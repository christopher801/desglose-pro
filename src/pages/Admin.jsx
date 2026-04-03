import React, { useState, useEffect } from 'react'
import { Container, Card, Table, Button, Badge, Alert } from 'react-bootstrap'
import { getAllUsers, unlockUser, lockUser } from '../services/userService'
import { useAuth } from '../context/AuthContext'

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
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <h4>⛔ Acceso Denegado</h4>
          <p>No tienes permisos de administrador para acceder a esta página.</p>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card className="card-modern">
        <Card.Body>
          <h4 className="mb-4">👑 Panel de Administración</h4>
          <p className="text-muted mb-4">Gestiona los usuarios y activa sus cuentas</p>
          
          {message && <Alert variant="info">{message}</Alert>}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table responsive bordered hover>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
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
                      <Badge bg={userItem.role === 'admin' ? 'danger' : 'secondary'}>
                        {userItem.role || 'user'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={userItem.isActive ? 'success' : 'warning'}>
                        {userItem.isActive ? 'ACTIVO' : 'BLOQUEADO'}
                      </Badge>
                    </td>
                    <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                    <td>
                      {userItem.role !== 'admin' && (
                        <>
                          {!userItem.isActive ? (
                            <Button 
                              size="sm" 
                              variant="success" 
                              onClick={() => handleUnlock(userItem.id)}
                            >
                              🔓 Activar
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="warning" 
                              onClick={() => handleLock(userItem.id)}
                            >
                              🔒 Bloquear
                            </Button>
                          )}
                        </>
                      )}
                      {userItem.role === 'admin' && (
                        <Badge bg="dark">Admin</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          <div className="mt-3">
            <small className="text-muted">
              Total de usuarios: {users.length}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Admin