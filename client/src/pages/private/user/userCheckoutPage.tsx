import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Button, Center, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconQrcode } from "@tabler/icons-react";

export function UserCheckoutPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [active, setActive] = useState(false);

  const startScanner = async () => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (text) => {
        console.log("QR Code detected:", text);
        // Handle the scanned QR code text here
        // send uuid to backend to check in
        stopScanner();
        navigator.vibrate?.(200);
      },
      () => {}
    );

    setActive(true);
  };

  const stopScanner = async () => {
    if (!scannerRef.current) return;

    await scannerRef.current.stop();
    scannerRef.current.clear();
    scannerRef.current = null;
    setActive(false);
  };

  useEffect(() => {
    return () => {
      stopScanner().catch(() => {});
    };
  }, []);

  return (
    <Center>
      <Center>
        <Stack align="center" gap="md">
          <ThemeIcon size={56} radius="xl" variant="light">
            <IconQrcode size={32} />
          </ThemeIcon>

          <Text c="dimmed" ta="center" size="sm">
            Klicke auf den Button, um die Kamera zu aktivieren und einen QR-Code
            zu scannen.
          </Text>

          <div
            id="qr-reader"
            style={{
              width: 300,
              display: active ? "block" : "none",
            }}
          />

          <Group mb="sm">
            {!active && (
              <Button onClick={startScanner}>Checkout starten</Button>
            )}
            {active && (
              <Button color="red" onClick={stopScanner}>
                Stoppen
              </Button>
            )}
          </Group>
        </Stack>
      </Center>
    </Center>
  );
}
