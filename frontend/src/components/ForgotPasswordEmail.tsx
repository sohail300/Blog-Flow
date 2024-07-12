import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// @ts-expect-error because React is need here.
import React from "react";

interface ForgotPasswordEmailProps {
  name: string;
  link: string;
}

export const ForgotPasswordEmail = ({
  name,
  link,
}: ForgotPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Password Reset Request</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          We received a request to reset the password for your account. If you
          didn't make this request, you can safely ignore this email.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={link}>
            Reset Your Password
          </Button>
        </Section>
        <Text style={text}>
          This link will expire in 1 hour. If you need to request a new password
          reset, please visit our website.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you're having trouble with the button above, copy and paste the URL
          below into your web browser:
        </Text>
        <Text style={url}>{link}</Text>
        <Text style={footer}>Made with 💗 by Blog Flow.</Text>
      </Container>
    </Body>
  </Html>
);

export default ForgotPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingTop: "32px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "10px 20px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const url = {
  color: "#007bff",
  fontSize: "14px",
  lineHeight: "24px",
  wordBreak: "break-all" as const,
};
