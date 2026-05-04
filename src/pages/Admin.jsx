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
        <Alert variant="danger" className="text-center" style={{
          background: '#fef3c7',
          border: '1px solid #a855f7',
          color: '#4a0e78'
        }}>
          <h4>⛔ Acceso Denegado</h4>
          <p>No tienes permisos de administrador para acceder a esta página.</p>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4" style={{
      background: 'linear-gradient(145deg, #4a0e78, #2e1065)',
      minHeight: '100vh',
      borderRadius: '0'
    }}>
      <Card className="card-modern" style={{
        border: '1px solid #a855f7',
        boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.3)'
      }}>
        <Card.Body>
          <h4 className="mb-4" style={{ color: '#4a0e78' }}>👑 Panel de Administración</h4>
          <p style={{ color: '#6b21a5' }} className="mb-4">Gestiona los usuarios y activa sus cuentas</p>
          
          {message && <Alert variant="info" style={{ background: '#e9d5ff', borderColor: '#a855f7', color: '#4a0e78' }}>{message}</Alert>}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#8b5cf6' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Table responsive bordered hover style={{ borderColor: '#a855f7' }}>
              <thead style={{ background: '#4a0e78', color: '#fef3c7' }}>
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
                    <td style={{ color: '#4a0e78' }}>{idx + 1}</td>
                    <td style={{ color: '#4a0e78' }}>{userItem.nombre || '-'}</td>
                    <td style={{ color: '#4a0e78' }}>{userItem.email}</td>
                    <td>
                      <Badge style={{ background: userItem.role === 'admin' ? '#a855f7' : '#8b5cf6' }}>
                        {userItem.role || 'user'}
                      </Badge>
                    </td>
                    <td>
                      <Badge style={{ background: userItem.isActive ? '#a855f7' : '#fef3c7', color: userItem.isActive ? 'white' : '#4a0e78' }}>
                        {userItem.isActive ? 'ACTIVO' : 'BLOQUEADO'}
                      </Badge>
                    </td>
                    <td style={{ color: '#4a0e78' }}>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                    <td>
                      {userItem.role !== 'admin' && (
                        <>
                          {!userItem.isActive ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleUnlock(userItem.id)}
                              style={{
                                background: '#a855f7',
                                border: 'none',
                                borderRadius: '50px',
                                padding: '5px 12px',
                                fontWeight: '600'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#8b5cf6'}
                              onMouseLeave={(e) => e.target.style.background = '#a855f7'}
                            >
                              🔓 Activar
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleLock(userItem.id)}
                              style={{
                                background: '#fef3c7',
                                border: '1px solid #a855f7',
                                borderRadius: '50px',
                                padding: '5px 12px',
                                fontWeight: '600',
                                color: '#4a0e78'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = '#a855f7'
                                e.target.style.color = 'white'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = '#fef3c7'
                                e.target.style.color = '#4a0e78'
                              }}
                            >
                              🔒 Bloquear
                            </Button>
                          )}
                        </>
                      )}
                      {userItem.role === 'admin' && (
                        <Badge style={{ background: '#4a0e78' }}>Admin</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          <div className="mt-3">
            <small style={{ color: '#8b5cf6' }}>
              Total de usuarios: {users.length}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Admin