import { publicAsset } from './assets'
import type { MediaAsset } from './portfolio'

export interface HobbyMedia extends MediaAsset { thumbnail: string }
export interface HobbyStory { title: string; paragraphs: string[] }
export interface HobbyAlbum extends HobbyStory { id: string; media: HobbyMedia[] }
export interface HobbyPage {
  eyebrow: string
  introduction: string
  albums: HobbyAlbum[]
  collection?: HobbyStory & { media: HobbyMedia }
  gaming?: { development: HobbyStory; together: HobbyStory }
}

const asset = (file: string) => publicAsset(`/media/hobbies/${file}`)
function photo(id: string, alt: string, width: number, height: number, caption = ''): HobbyMedia {
  return { id, src: asset(`${id}.webp`), thumbnail: asset(`${id}-thumb.webp`), alt, caption, placeholder: alt, width, height, fit: 'contain' }
}
function clip(id: string, alt: string, width: number, height: number, caption: string): HobbyMedia {
  return { id, kind: 'video', src: asset(`${id}.mp4`), poster: asset(`${id}-poster.webp`), thumbnail: asset(`${id}-thumb.webp`), alt, caption, placeholder: alt, width, height, fit: 'contain' }
}

export const hobbyPages: Record<string, HobbyPage> = {
  fishing: {
    eyebrow: 'A little time by the water',
    introduction: "Fishing has been part of my life since I was little. It is one of the ways I like to slow down: spend a few hours outside, pay attention to the water and let everything else wait for a while. A good catch is always welcome, but the time spent getting there is a big part of why I keep coming back.",
    albums: [
      { id: 'fishing-now', title: 'One more cast', paragraphs: [
        "Over the years I've tried different kinds of freshwater fishing, and I still enjoy the variety. Lure fishing and ultralight setups are what I gravitate towards most, though. I like having something to figure out: where to cast, how to work the lure, when to change things and when to give a spot a little more time.",
        "There is something satisfying about paying attention to those small details. With light tackle, even a small fish can make a memorable catch. These photos and the short clip are a few moments from that side of my life, away from a desk and with a rod in my hands.",
      ], media: [
        photo('fishing/by-the-water', 'Bogdan holding a catch on a tree-lined riverbank', 1200, 1600),
        photo('fishing/ultralight', 'A small fish held above the water', 640, 1138),
        clip('fishing/on-the-water', 'Bogdan casting a fishing rod from the riverbank', 576, 1024, 'A moment by the water · 12 sec'),
      ] },
      { id: 'fishing-childhood', title: 'Where it started', paragraphs: [
        "The childhood photos probably explain this hobby better than I could. Fishing was already something I looked forward to back then, and every catch felt worth a photograph. Looking at these now, it is nice to see how long that excitement has stayed with me.",
        "The gear and the way I fish have changed, but the feeling is familiar. I still enjoy the anticipation before a bite, the little surprises and the excuse to spend a day by the water. This is my small archive of where it all began.",
      ], media: [
        photo('fishing/childhood-1', 'Young Bogdan holding a fish in front of a green wall', 1600, 1200),
        photo('fishing/childhood-2', 'Young Bogdan with a catch under the trees', 1600, 1200),
        photo('fishing/childhood-3', 'Young Bogdan in a hoodie holding a large fish outdoors', 1600, 1200),
      ] },
    ],
  },
  basketball: {
    eyebrow: 'On and off the court',
    introduction: "Basketball has been a constant in my life since I started training at 11. It has taken me through different clubs, school teams and university games, but the part I value most has stayed the same: being part of a team, working towards something together and knowing that everyone has a role to play.",
    albums: [
      { id: 'basketball-team', title: 'Always a team game', paragraphs: [
        "After starting at KK Radnički Ratkovo, I went on to play for several clubs and stayed active until recently. Along the way, I competed with my primary and high school teams, and played with a university team on a few occasions too. Different jerseys and different teammates, but always that shared feeling of showing up for each other.",
        "That is what I love about basketball. A good pass, talking on defense or helping a teammate recover after a mistake can matter just as much as making a shot. It has taught me to listen, adapt and keep putting in the effort when a game isn't going our way. I still play in my free time, including at École Polytechnique, and I am always happy to have a reason to get back on a court.",
      ], media: [
        photo('basketball/outdoor-team', 'Basketball teammates and friends together on an outdoor court', 1600, 1200),
        photo('basketball/indoor-team', 'Bogdan and his basketball team posing on an indoor court', 1600, 1200),
        clip('basketball/on-court', 'A short clip of a basketball game on an indoor court', 576, 1024, 'On the court · 8 sec'),
      ] },
      { id: 'basketball-childhood', title: 'The early days', paragraphs: [
        "These are a few memories from when basketball was becoming a big part of my everyday life. Training, camp and games were a chance to learn, but also a place to make friends and get used to doing something as a group.",
        "Watching an old clip is a reminder of how much starts with simply enjoying the game. Long before thinking about results or competitions, there was the fun of playing together and wanting to come back for the next session. That is the part I hope to keep, wherever I play.",
      ], media: [
        photo('basketball/camp', 'A childhood basketball camp group posing under a camp banner', 960, 720),
        clip('basketball/camp-game', 'Children playing basketball together on an outdoor court', 496, 368, 'From the childhood archive · 11 sec'),
      ] },
    ],
  },
  'board-games': {
    eyebrow: 'A small escape from reality',
    introduction: "Board games are my little escape from reality. For a few hours, the important things become what is happening on the table, what everyone is planning and whether my very carefully considered strategy will survive the next turn. Add good company, and that is a pretty good way to spend an evening.",
    collection: {
      title: 'A shelf full of possibilities',
      paragraphs: [
        "This is my treasured collection. I have a soft spot for complex strategy games, especially Root, Terraforming Mars, Arcs and Ark Nova. I enjoy games that take a little time to get to know, where each session gives me another idea to try and another reason to bring the box back to the table.",
        "Part of the pleasure is seeing all those different worlds together on a shelf. Each box promises a different kind of evening, and the collection has become a very personal corner of my home. It is a collection I love playing as much as I love looking at.",
      ],
      media: photo('board-games/collection', 'Bogdan’s board game collection arranged across three shelves', 1266, 1600),
    },
    albums: [{ id: 'board-game-nights', title: 'Around the table', paragraphs: [
      "As much as I enjoy the systems and the strategy, the people around the table are what make a session memorable. I like the discussions, the unexpected moves and the moment someone spots a possibility the rest of us missed. Even a competitive game is something we are making an evening of together.",
      "These photos are a few pieces of that: games at home, meetups and plenty of time spent thinking about the next move. Winning is fun, of course, but a game that leaves everyone talking about what happened is usually one I want to play again.",
    ], media: [
      photo('board-games/ark-nova', 'Friends leaning over a game of Ark Nova', 1600, 900),
      photo('board-games/game-night-4', 'Friends playing board games around a long table', 1600, 900),
      photo('board-games/game-night-1', 'Two friends considering their next move at a board game table', 1169, 848),
      photo('board-games/game-night-2', 'A player studying a board game in a game café', 900, 1600),
      photo('board-games/game-night-5', 'Cards and a game board spread across the table', 1200, 1600),
      photo('board-games/game-night-6', 'A game in progress around the table at home', 1600, 1200),
      photo('board-games/game-night-7', 'A player holding cards above a busy board game table', 1600, 1200),
      photo('board-games/game-night-8', 'Two friends playing a colorful tile game', 1600, 1200),
      photo('board-games/game-night-9', 'Choosing a move in a colorful board game', 1200, 1600),
      photo('board-games/game-night-10', 'Three friends gathered for a board game', 1600, 900),
    ] }],
  },
  games: {
    eyebrow: 'Playing, watching, wondering how it works',
    introduction: "I love getting lost in a good game, but I also find myself wondering how it was made. Indie games are my favorite corner of that world: a place where a small team can build something with a very distinct personality. Hollow Knight and Silksong are at the top of my list, with Hades, Celeste and DREDGE close by.",
    albums: [],
    gaming: {
      development: {
        title: 'The game behind the game',
        paragraphs: [
          "A lot of my interest in games continues after I stop playing. I follow smaller projects and spend time watching devlogs, often just as curious about an unfinished prototype as the final release. I enjoy seeing a mechanic take shape, watching an idea get tested and changed, and understanding how a developer gets from a rough experiment to something that feels good to play.",
          "The details are what draw me in: movement, animation, lighting, a camera that makes a scene feel right, or the feedback that makes a simple action satisfying. I like looking at the tools and techniques behind those decisions and thinking about how I might approach them myself. It connects naturally with my interest in graphics and game development, and gives me plenty of things I want to explore in my own projects.",
        ],
      },
      together: {
        title: 'Better with someone beside you',
        paragraphs: [
          "There is also a very social side to gaming for me. I enjoy playing It Takes Two with my girlfriend, finding co-op games to share with friends and playing League of Legends. Sometimes the best part of a session is working something out together, making a plan and then laughing when it goes completely differently.",
          "I like that sense of being on the same side: communicating, making room for what each person does well and helping each other through the difficult bits. Whether it is a carefully made indie world or a chaotic evening with friends, games give me both inspiration and a way to spend time with people I care about.",
        ],
      },
    },
  },
}

export const steamProfile = 'https://steamcommunity.com/profiles/76561199364383318/'
const steamFavorites = [
  { title: 'Hollow Knight', slug: 'hollow-knight', app: 367520, favorite: true },
  { title: 'Hollow Knight: Silksong', slug: 'silksong', app: 1030300, favorite: true },
  { title: 'Hades', slug: 'hades', app: 1145360 },
  { title: 'Celeste', slug: 'celeste', app: 504230 },
  { title: 'DREDGE', slug: 'dredge', app: 1562430 },
  { title: 'It Takes Two', slug: 'it-takes-two', app: 1426210 },
  { title: 'Brawlhalla', slug: 'brawlhalla', app: 291550 },
  { title: 'Road 96', slug: 'road-96', app: 1466640 },
  { title: 'Supraland', slug: 'supraland', app: 813630 },
  { title: 'Slay the Spire', slug: 'slay-the-spire', app: 646570 },
]
export const favoriteGames = [
  ...steamFavorites.map(game => ({ ...game, image: asset(`games/${game.slug}.webp`), url: `https://store.steampowered.com/app/${game.app}/`, destination: 'Steam' })),
  { title: 'League of Legends', slug: 'league-of-legends', favorite: false, image: asset('games/league-of-legends.webp'), url: 'https://www.leagueoflegends.com/en-us/', destination: 'the official League of Legends site' },
]
