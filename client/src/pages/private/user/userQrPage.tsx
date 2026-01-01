import { Center, Text } from "@mantine/core";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import type { QRResponse } from "../../../models/response";
import { fetchJSON } from "../../../utils/api";
import { useUserState } from "../../../states/user/userState";

export function UserQrPage({ action }: { action: "checkin" | "checkout" }) {
  const { userId } = useUserState();

  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const endpoint =
      action === "checkin" ? "/api/qrcode/in" : "/api/qrcode/out";

    fetchJSON<QRResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }).then((response) => {
      const qrValue = JSON.stringify({
        payload: response.payload,
        signature: response.signature,
      });

      setQrCode(qrValue);
    });
  }, [action, userId]);

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
        QR-Code scane to {action === "checkin" ? "check in" : "check out"}.
      </Text>
    </>
  );
}
