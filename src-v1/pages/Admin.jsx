import React, { useState, useEffect } from 'react'
import { Container, Card, Button, Alert } from 'react-bootstrap'
import { getAllUsers, unlockUser, lockUser } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import AdminNotifications from '../components/AdminNotifications'

const Admin = () => {
  const { isAdmin, user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const result = await getAllUsers()
    if (result.success) {
      setUsers(result.users)
    }
    setLoading(false)
  }

  const handleUnlock = async (userId) => {
    const result = await unlockUser(userId)
    if (result.success) {
      setMessage('✅ Usuario activado exitosamente')
      loadUsers()
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('❌ Error al activar usuario')
    }
  }

  const handleLock = async (userId) => {
    const result = await lockUser(userId)
    if (result.success) {
      setMessage('🔒 Usuario bloqueado exitosamente')
      loadUsers()
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('❌ Error al bloquear usuario')
    }
  }

  if (!isAdmin) {
    return (
      <Container className="py-4">
        <div className="card-modern p-5 text-center">
          <div style={{ fontSize: '48px' }}>⛔</div>
          <h4 className="mt-3">Acceso Denegado</h4>
          <p className="text-muted">No tienes permisos de administrador</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <div className="card-modern">
        <div className="p-4 border-bottom">
          <h4 className="mb-0">👑 Panel de Administración</h4>
          <p className="text-muted mb-0 mt-1">Gestiona los usuarios y activa sus cuentas</p>
        </div>
        
        <div className="p-4">
          {message && <Alert variant="info" className="mb-4">{message}</Alert>}
          
          {loading ? (
            <div className="text-center py-5">Cargando...</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem, idx) => (
                      <tr key={userItem.id}>
                        <td>{idx + 1}</td>
                        <td>{userItem.nombre || '-'}</td>
                        <td>{userItem.email}</td>
                        <td>
                          {userItem.role === 'admin' ? (
                            <span className="badge-professional badge-admin">Admin</span>
                          ) : (
                            <span className="badge-professional">Usuario</span>
                          )}
                        </td>
                        <td>
                          {userItem.isActive ? (
                            <span className="badge-professional badge-active">Activo</span>
                          ) : (
                            <span className="badge-professional badge-inactive">Bloqueado</span>
                          )}
                        </td>
                        <td>{userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                          {userItem.role !== 'admin' && (
                            <>
                              {!userItem.isActive ? (
                                <Button 
                                  size="sm" 
                                  variant="success" 
                                  onClick={() => handleUnlock(userItem.id)}
                                  className="me-2"
                                >
                                  Activar
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="warning" 
                                  onClick={() => handleLock(userItem.id)}
                                >
                                  Bloquear
                                </Button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted">Total: {users.length} usuarios</small>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Notifications Section */}
      <div className="mt-4">
        <AdminNotifications />
      </div>
    </Container>
  )
}

export default Admin