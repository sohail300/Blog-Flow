import {
  Body,
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

export const VerificationEmail = ({
  otp,
  name,
}: {
  otp: number;
  name: string;
}) => (
  <Html>
    <Head />
    <Preview>Verify your account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify Your Account</Heading>
        <Text style={text}>Hello {name},</Text>
        <Text style={text}>
          Thank you for signing up. To complete your registration, please use
          the following OTP to verify your account:
        </Text>
        <Section style={codeContainer}>
          <Text style={code}>{otp}</Text>
        </Section>
        <Text style={text}>
          This OTP will expire in 1 hour. If you didn't request this
          verification, please ignore this email.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Made with 💗 by Blog Flow.</Text>
      </Container>
    </Body>
  </Html>
);

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

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "16px 0",
  padding: "8px 0",
};

const code = {
  color: "#000",
  display: "block",
  fontFamily: "monospace",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "4px",
  lineHeight: "100%",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  textAlign: "center" as const,
  width: "100%",
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
