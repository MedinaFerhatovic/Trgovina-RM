// pages/politika.tsx
import Head from 'next/head';

export default function PolitikaPrivatnosti() {
  return (
    <>
      <Head>
        <title>Politika privatnosti | Trgovina RM</title>
        <meta name="description" content="Saznajte više o načinu prikupljanja i zaštite vaših podataka." />
      </Head>
      <main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Politika privatnosti</h1>
        <p className="mb-4">
          Trgovina RM poštuje vašu privatnost i obavezuje se na zaštitu ličnih podataka korisnika.
        </p>
        <ul className="list-disc ml-6 space-y-2 mb-4">
          <li>Podaci se prikupljaju isključivo radi obrade narudžbi i poboljšanja korisničkog iskustva.</li>
          <li>Ne dijelimo lične podatke s trećim stranama bez vašeg izričitog pristanka.</li>
          <li>Imate pravo zatražiti pristup, ispravku ili brisanje svojih podataka u bilo kojem trenutku.</li>
        </ul>
        <p>
          Korištenjem ove stranice pristajete na uslove navedene u ovoj politici privatnosti.
        </p>
      </main>
    </>
  );
}
