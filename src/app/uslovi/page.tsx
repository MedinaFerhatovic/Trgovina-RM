// pages/uslovi.tsx
import Head from 'next/head';

export default function UsloviKoristenja() {
  return (
    <>
      <Head>
        <title>Uslovi korištenja | Trgovina RM</title>
        <meta name="description" content="Pročitajte uslove korištenja web stranice Trgovina RM." />
      </Head>
      <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Uslovi korištenja</h1>
        <p className="mb-4">
          Korištenjem ove web stranice, korisnik prihvata sljedeće uslove korištenja. 
        </p>
        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>Stranica i njen sadržaj namijenjeni su za ličnu i nekomercijalnu upotrebu.</li>
          <li>Zabranjeno je kopiranje, distribucija ili modifikacija sadržaja bez pismene dozvole.</li>
          <li>Zadržavamo pravo izmjene ponude, cijena i dostupnosti proizvoda bez prethodne najave.</li>
          <li>Trgovina RM nije odgovorna za eventualne tehničke greške ili prekide u radu stranice.</li>
        </ul>
        <p>
          Ukoliko se ne slažete s navedenim uslovima, molimo vas da ne koristite ovu stranicu.
        </p>
      </main>
    </>
  );
}
