import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

// @ts-expect-error because React is need here.
import React from "react";

interface NotificationEmailProps {
  blogTitle: string;
  blogLink: string;
}

export const NotificationEmail = ({
  blogTitle,
  blogLink,
}: NotificationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Blog Published: {blogTitle}</Heading>
        <Text style={text}>Hello Blog Flow User,</Text>
        <Text style={text}>
          We're excited to let you know that a new blog post has been published
          on Blog Flow!
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={blogLink}>
            Read the Blog Post
          </Button>
        </Section>
        <Text style={text}>
          Don't miss out on this interesting new content. Click the button above
          to read the full post!
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you're having trouble with the button above, copy and paste the URL
          below into your web browser:
        </Text>
        <Text style={url}>{blogLink}</Text>
        <Text style={footer}>
          You received this email because you're subscribed to Blog Flow
          notifications. To unsubscribe, please visit your account settings.
        </Text>
        <Text style={footer}>Made with 💗 by Blog Flow.</Text>
      </Container>
    </Body>
  </Html>
);

export default NotificationEmail;

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
