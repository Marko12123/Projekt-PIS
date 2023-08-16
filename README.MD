# Program za upravljanje rezervacijama tura gliserima

## Upute

- Skinite projekt preko githuba na [linku](https://github.com)
- Otvorite folder te navigirajte sa terminalom do njega
- Pokrenite komandu `docker build -t rezervacije_app .`
- Kada se dovrši pokrenite komandu `docker run -p 5000:5000 rezervacije_app`
- Otvorite preglednik te idite na [localhost](http://127.0.0.1:5000/)

---

## Mogućnosti

- Stvaranje novih rezervacija upisivanjem u sva polja (popust je opcionalan) pod Nova Rezervacija te klikom na Rezerviraj.
- Pregled svih IDova rezervacija i imena nositelja ako se upiše 0 i klikne traži.
- Ako se upiše neki drugi ID i traži će se pokazati detalji tražene rezervacije
- Također se preko ID-a mogu obrisati rezervacije
- Preko ID-a se mogu i promjeniti detalji rezervacije tako da se upiše dole ID, te se popune detalji u polju za nova rezervacija i klikne na promjeni.
- Ispod toga su 2 grafa, prvi prikazuje koliko svaki vodić ima rezervacija, a drugi prikazuje koliko je ukupno trajanje u minutama kada se sve njihove rezervacije zbroje.
  - Potrebno za vidjeti tko radi koliko zbog plaće i podjele posla

---

## Moji podaci
