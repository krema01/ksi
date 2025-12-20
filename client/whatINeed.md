Post /api/login
    (username, passwort) => (username, id, role)

Post /api/logout
    () => void


Get /api/users
Create /api/user
Delete /api/user/{id}
Put /api/user/{id}
    (name, role) => void

Get /api/timeEntries
Create /api/timeEntry
Delete /api/timeEntry/{id}
Put /api/timeEntry/{id}
    (userId, from, until) => void

Get /api/qrCode
    // returns qrCodeUUID for the context qr Role

Post /checkin
    (userId, qrCodeUUID) => void
Post /checkout
    (userId, qrCodeUUID) => void


Get /api/user/timeEntries
    // returns all timeEntries from a user