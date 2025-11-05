import "./css/global.css";

export const metadata = {
  icons: {
    icon: "/favicon.png",
  },
  title: "Refelct CI/CD",
  description: "Self Deployable System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
