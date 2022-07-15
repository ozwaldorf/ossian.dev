const header = {
  homepage: 'https://ossian.dev/',
}

const about = {
  name: 'Ossian Mapes',
  role: 'Software Developer, Musician',
  description: [
    "I'm Ossian, a fullstack software developer.",
    'I play piano in my freetime, and enjoy using my brain',
  ],
  resume: 'https://github.com/ozwaldorf',
  social: {
    linkedin: 'https://www.linkedin.com/in/ossian-m-465275127/',
    github: 'https://github.com/ozwaldorf',
    email: 'mailto:self@ossian.dev',
  },
}

const projects = [
  {
    name: 'Curation Canister POC',
    description:
      'POC, completely on-chain, NoSQL database. Provides indexing and filtering for NFTs and Jelly transactions.',
    stack: ['Internet Computer', 'Rust', 'Blockchain', 'NoSQL'],
    sourceCode: 'https://github.com/ozwaldorf/curation_poc',
    livePreview: 'https://j2brg-liaaa-aaaah-abmta-cai.ic0.app/',
  },
  {
    name: 'Jelly Marketplace',
    description: 'Open source NFT marketplace protocol.',
    stack: ['Rust', 'Blockchain', 'AWS', 'DynamoDB'],
    sourceCode: 'https://github.com/psychedelic/nft-marketplace',
    livePreview: 'https://jelly.xyz/',
  },
  {
    name: 'cover-builder CLI',
    description: 'CLI for submitting cover.ooo builds using a dfx identity.',
    stack: ['Node', 'Cryptography', 'Blockchain'],
  },
  {
    name: 'Principal ID Bruteforce',
    description:
      'Bruteforce generate principal ids with a human readable prefix',
    stack: ['shell', 'dfx', 'plugwallet'],
    sourceCode: 'https://github.com/ozwaldorf/principal_bruteforce',
  },
  {
    name: 'Cipherproxy',
    description:
      'A web3 research collective and project laboratory developing decentralized projects and protocols',
    stack: ['Unity', 'C#', 'Web', 'Blockchain'],
    sourceCode: 'https://github.com/CipherProxy',
  },
  {
    name: 'upld.is',
    description: 'A free to use pastebin for the command line',
    stack: ['Golang', 'Pastebin', 'Command Line Utility'],
    sourceCode: '',
    livePreview: 'https://upld.is',
  },
  {
    name: 'Tidalwave / API',
    description: 'Api in golang for Tidal, the music streaming platform',
    stack: ['Golang', 'REST', 'Encryption', 'Security'],
    sourceCode: 'https://github.com/ozwaldorf/tidal',
  },
  {
    name: 'rekt.network',
    description:
      'Hub for EDM enthusiasts. Get REKT! Helped create the initial golang backend for a custom QUIC web server rolled up with a websocket IRC bridge, and radio streaming.',
    stack: ['Golang', 'QUIC', 'Icecast', 'Websockets', 'IRC'],
    livePreview: 'https://rekt.network',
  },
  {
    name: 'Arbicrypt LLC ',
    description:
      'Arbitrage crypto trading platform, project was abandoned due to oversaturation',
    stack: [
      'Golang',
      'WebSockets',
      'Cryptocurrency',
      'Trading',
      'Bot',
      'Blockchain',
    ],
    sourceCode: '',
  },
  {
    name: 'Kingfisher Wallpapers',
    description:
      'A shell script to automatically create beautiful blurred wallpapers',
    stack: ['Shell'],
    sourceCode: 'https://github.com/ozwaldorf/kingfisher',
  },
]

const experiences = [
  {
    name: 'Psychedelic DAO / Fleek.co / Jelly.xyz',
    title: 'Fullstack Developer',
    description:
      'A decentralized product studio focused on building Web3 products. Lead the development of the Jelly.xyz decentralized NFT marketplace protocol.',
    duration: 'Feb 2022 - Present',
    stack: ['Rust', 'Internet Computer', 'Web3'],
    link: 'https://psychedelic.ooo',
  },
  {
    name: 'Arbicrypt LLC',
    title: 'Backend Developer',
    description:
      'A startup to create a arbitrage trading platform where users could deposit crypto into a pool and earn interest',
    duration: '2016 - 2017',
    stack: ['Golang', 'Python', 'Blockchain', 'Trading'],
  },
]

const skills = ['Rust,', 'Golang,', 'C (#),', 'Web,', 'React.js']

const contact = {
  email: 'self@ossian.dev',
}

export { header, about, projects, experiences, skills, contact }
