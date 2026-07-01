import "./globals.css";
export const metadata = {
    title: "Growkaro | Quality Product Ad Optimization",
    description: "Target-ad optimization platform with GrowScore performance meters, guides, and UCB reinforcement learning analytics."
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <body>{children}</body>
    </html>);
}
