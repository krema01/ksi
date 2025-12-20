import { Center, Text } from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
import { useQRCodeState } from "../../../states/qrCode/qrCodeState";

export function QrCodePage() {
  const { qrCode } = useQRCodeState();

  return (
    <>
      <Center>
        <QRCodeSVG
          value={qrCode}
          size={220}
          bgColor="#ffffff"
          fgColor="#000000"
          level="M"
        />
      </Center>

      <Text ta="center" mt="md" size="sm" c="dimmed">
        QR-Code scane to continue
      </Text>
    </>
  );
}
