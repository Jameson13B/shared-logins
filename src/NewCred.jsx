/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Button, Drawer, Input, Space, Typography } from 'antd'
import { addCredentials } from './firebase'

export const NewCred = (props) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const onClose = () => {
    props.setOpen(false)
    setName('')
    setUsername('')
    setPassword('')
  }
  const onSubmit = () => {
    if (!name || !username || !password) {
      props.messageApi.open({
        type: 'error',
        content: 'All fields are required',
      })
    } else {
      props.messageApi.open({
        type: 'success',
        content: 'New login created',
      })
      addCredentials({ name, username, password })
      onClose()
    }
  }
  return (
    <>
      <Drawer
        title="New Login"
        width={720}
        onClose={onClose}
        open={props.open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSubmit()} type="primary">
              Create
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 4 }}>
          <Typography.Text strong>Website/app Name</Typography.Text>
        </div>
        <Input
          placeholder="Website/app Name"
          name="name"
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 20 }}
          value={name}
        />
        <div style={{ marginBottom: 4 }}>
          <Typography.Text strong>Username</Typography.Text>
        </div>
        <Input
          placeholder="Username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 20 }}
          value={username}
        />
        <div style={{ marginBottom: 4 }}>
          <Typography.Text strong>Password</Typography.Text>
        </div>
        <Input
          placeholder="Password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 20 }}
          value={password}
        />
      </Drawer>
    </>
  )
}
