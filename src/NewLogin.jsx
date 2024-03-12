import { Button, Collapse, Form, Input } from "antd";
import { addCredentials } from "./firebase";

export const NewLogin = () => {
	const onFinish = (values) => {
		addCredentials(values);
		console.log("Success:", values);
	};

	return (
		<Collapse
			bordered={false}
			size="small"
			items={[
				{
					key: "1",
					label: <span style={{ fontWeight: "bold" }}>Create new login</span>,
					children: (
						<Form name="new-login" onFinish={onFinish} autoComplete="off">
							<Form.Item
								label="Website/app Name"
								name="name"
								rules={[
									{
										required: true,
										message: "Please input your website/app name!",
									},
								]}
							>
								<Input />
							</Form.Item>

							<Form.Item
								label="Username"
								name="username"
								rules={[
									{
										required: true,
										message: "Please input your username!",
									},
								]}
							>
								<Input />
							</Form.Item>

							<Form.Item
								label="Password"
								name="password"
								rules={[
									{
										required: true,
										message: "Please input your password!",
									},
								]}
							>
								<Input.Password />
							</Form.Item>

							<Form.Item>
								<Button type="primary" htmlType="submit">
									Submit
								</Button>
							</Form.Item>
						</Form>
					),
				},
			]}
			style={{
				background: "white",
				width: "100%",
				maxWidth: "85%",
				margin: "0 auto 20px",
			}}
		/>
	);
};
