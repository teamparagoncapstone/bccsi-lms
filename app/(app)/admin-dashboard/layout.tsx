export const metadata = {
  title: "BCCSI Learning Management System",
  description: "BCCSI Learning Management System.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
