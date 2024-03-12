import { useEffect, useState } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Input, message, Popconfirm, Skeleton } from 'antd'
import { deleteCredentials, db } from './firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'

import { NewCred } from './NewCred'

function App() {
  const isSmall = useMediaQuery('(max-width: 678px)')
  const [messageApi, contextHolder] = message.useMessage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'shared-logins'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const creds = []
      querySnapshot.forEach((doc) => {
        creds.push({ ...doc.data(), id: doc.id })
      })

      setCredentials(creds)
    })

    return () => unsubscribe()
  }, [])

  const handleAuth = (value) =>
    window.btoa(value) === 'ODUxMA=='
      ? setIsAuthenticated(true)
      : messageApi.open({ type: 'error', content: 'Incorrect pin' })
  const copyAndLog = (text, name) => {
    copyTextToClipboard(text)
    messageApi.open({
      type: 'success',
      content: `${name} copied to clipboard`,
    })
  }
  const handleDelete = (id) => {
    deleteCredentials(id)
    messageApi.open({ type: 'success', content: 'Login deleted' })
  }

  return (
    <Flex vertical style={{ height: '100vh' }}>
      <h1
        style={{
          width: '85%',
          margin: '20px auto',
          textAlign: 'center',
          fontSize: '2.5rem',
        }}
      >
        {"Brown's Shared Logins"}
      </h1>
      {!isAuthenticated ? (
        <Input.Search
          placeholder="Enter pin to unlock"
          enterButton="Unlock"
          size="large"
          onSearch={handleAuth}
          style={{ width: '85%', maxWidth: '400px', margin: '0 auto 20px' }}
        />
      ) : (
        <Button
          onClick={() => setOpen(true)}
          style={{ width: '85%', maxWidth: '400px', margin: '0 auto 20px' }}
        >
          Add login
        </Button>
      )}
      <Flex
        justify="space-evenly"
        wrap="wrap"
        style={{
          width: '85%',
          margin: '0 auto 20px',
          overflow: 'auto',
        }}
      >
        {credentials?.map((cred) => {
          return (
            <Card
              extra={
                <Popconfirm
                  title="Delete login?"
                  description="Are you sure to delete this login?"
                  onConfirm={() => handleDelete(cred.id)}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  okText="Yes"
                  cancelText="No"
                >
                  {isAuthenticated && (
                    <Button danger size="small">
                      Delete
                    </Button>
                  )}
                </Popconfirm>
              }
              key={cred.id}
              title={cred.name}
              style={{ width: isSmall ? '100%' : '40%', marginBottom: 20 }}
              size="small"
              type="inner"
            >
              <Skeleton
                loading={!isAuthenticated}
                paragraph={{ rows: 2 }}
                title={false}
              >
                <Flex justify="space-between" align="center">
                  <p style={{ fontStyle: 'italic' }}>
                    <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>
                      Username:
                    </span>{' '}
                    {cred.username}
                  </p>
                  <Button
                    onClick={() => copyAndLog(cred.username, 'Username')}
                    size="small"
                  >
                    Copy
                  </Button>
                </Flex>
                <Flex justify="space-between" align="center">
                  <p style={{ fontStyle: 'italic' }}>
                    <span style={{ fontWeight: 'bold', fontStyle: 'normal' }}>
                      Password:
                    </span>{' '}
                    {cred.password}
                  </p>
                  <Button
                    onClick={() => copyAndLog(cred.password, 'Password')}
                    size="small"
                  >
                    Copy
                  </Button>
                </Flex>
              </Skeleton>
            </Card>
          )
        })}
      </Flex>
      {contextHolder}
      <NewCred messageApi={messageApi} open={open} setOpen={setOpen} />
    </Flex>
  )
}

export default App

const useMediaQuery = (query) => {
  const mediaMatch = window.matchMedia(query)
  const [matches, setMatches] = useState(mediaMatch.matches)

  useEffect(() => {
    const handler = (e) => setMatches(e.matches)
    mediaMatch.addListener(handler)
    return () => mediaMatch.removeListener(handler)
  })

  return matches
}
async function copyTextToClipboard(text) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}
