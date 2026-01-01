import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Button, Center, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconQrcode } from "@tabler/icons-react";
import { fetchJSON } from "../../../utils/api";
import type { ScanResponse } from "../../../models/response";

export function QrScanPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [active, setActive] = useState(false);

  const startScanner = async () => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (text) => async () => {
        const response = await fetchJSON<ScanResponse>("/api/scan", {
          method: "POST",
          body: JSON.stringify(text),
        });

        if (response.misuse) {
          alert("Missbrauch erkannt: " + response.reson);
        }

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
            {!active && <Button onClick={startScanner}>Scan starten</Button>}
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
