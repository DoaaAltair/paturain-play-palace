# 🎮 Paturain Play Palace

Een interactieve gaming ervaring gebouwd met React en TypeScript, waar spelers kunnen genieten van de Paturain Racer game.

## 🚀 Features

### Paturain Racer
- **Dynamisch Gameplay**: Race met je Paturain auto door het verkeer
- **Score Systeem**: 
  - Verdien punten door te overleven
  - Verzamel Paturain pakken voor bonus punten
  - Houd je high score bij
- **Geluideffecten**:
  - Start geluid
  - Rijgeluid tijdens het spelen
  - Game over geluid
- **Responsive Design**: Speel op verschillende schermformaten
- **Leaderboard**: Bekijk de top 3 spelers

## 🎯 Spelregels

### Besturing
- Gebruik de pijltjestoetsen omhoog en omlaag om te sturen
- Ontwijk de rode auto's
- Vang Paturain pakken voor 50 bonus punten
- Het spel wordt sneller na elke 500 punten

### Punten verdienen
- 1 punt per seconde overleven
- 50 bonus punten per Paturain pak
- Probeer je high score te verbeteren!

## 🛠️ Technische Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide Icons
- **Audio**: HTML5 Audio API

## 🚀 Installatie

1. Clone de repository:
```bash
git clone [repository-url]
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in je browser

## 📁 Project Structuur

```
paturain-play-palace/
├── public/
│   ├── sounds/           # Game geluiden
│   │   ├── game-start.mp3
│   │   ├── car-driving.mp3
│   │   └── game-over.mp3
│   ├── paturain-auto.png # Speler auto
│   ├── rode-auto.png     # Obstakel auto's
│   └── paturain-pak.png  # Bonus items
├── src/
│   ├── components/
│   │   ├── games/        # Game componenten
│   │   └── ui/           # UI componenten
│   └── ...
└── ...
```

## 🎨 Customisatie

### Geluiden aanpassen
Vervang de geluidsbestanden in de `public/sounds` map:
- `game-start.mp3`
- `car-driving.mp3`
- `game-over.mp3`

### Afbeeldingen aanpassen
Vervang de afbeeldingen in de `public` map:
- `paturain-auto.png`
- `rode-auto.png`
- `paturain-pak.png`

## 🤝 Bijdragen

1. Fork de repository
2. Maak een nieuwe branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📝 Licentie

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 🙏 Credits

- Ontwikkeld door [Jouw Naam/Team]
- Speciale dank aan alle testers en bijdragers
