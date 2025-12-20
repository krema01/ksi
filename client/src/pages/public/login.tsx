import { Container } from "@mantine/core";
import { AuthenticationForm } from "../../components/AuthenticationForm/authenticationForm";

export function LoginPage() {
  return (
    <Container size={460} my={30}>
      <AuthenticationForm />
    </Container>
  );
}
