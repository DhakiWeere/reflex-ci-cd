import "./global.css";

export const metadata = {
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
