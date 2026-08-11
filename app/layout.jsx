import './globals.css';

export const metadata = {
  metadataBase: new URL('https://legendwear.kg'),
  title: 'LEGEND WEAR — Create Your Legend',
  description:
    'Premium oversized T-shirts for the new generation. Limited drops, heavyweight cotton, Bishkek based — worldwide mindset.',
  openGraph: {
    title: 'LEGEND WEAR — Create Your Legend',
    description:
      'Premium oversized T-shirts for the new generation. Limited drops. Once gone — gone.',
    images: ['/legend-mark.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400;1,6..96,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
