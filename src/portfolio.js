const header = {
  homepage: 'https://ossian.dev/',
}

const about = {
  name: 'Ossian Mapes',
  role: 'Software Developer, Musician',
  description: [
    "Hi! I'm Ossian, a fullstack software developer.",
    'I play piano in my free time, and enjoy using my brain to solve problems.',
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
    name: 'Emporium',
    description: 'On chain discord bot - with dip20 rewards and a dip721 shop',
    stack: ['Rust', 'Internet Computer', 'DIP20', 'DIP721'],
    sourceCode: 'https://github.com/emporium-bot',
    livePreview: 'https://emporiumbot.xyz',
  },
  {
    name: 'Curation Canister POC',
    description:
      'Completely on-chain, NoSQL database. Provides indexing and filtering for NFTs and Jelly transactions.',
    stack: ['Internet Computer', 'Rust', 'Blockchain', 'NoSQL'],
    sourceCode: 'https://github.com/ozwaldorf/curation_poc',
    livePreview: 'https://j2brg-liaaa-aaaah-abmta-cai.ic0.app/',
  },
  {
    name: 'Jelly Marketplace',
    description: 'Open sourced NFT marketplace protocol.',
    stack: ['Rust', 'Blockchain', 'AWS', 'DynamoDB'],
    sourceCode: 'https://github.com/psychedelic/nft-marketplace',
    livePreview: 'https://jelly.xyz/',
  },
  {
    name: 'cover-builder CLI',
    description: 'CLI for submitting cover.ooo builds using a dfx identity.',
    stack: ['Node', 'Cryptography', 'Blockchain'],
    sourceCode: 'https://github.com/ozwaldorf/cover-builder',
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
    name: 'Fleek Network',
    title: 'Backend Developer',
    description:
      'A Decentralized Content and Application Delivery Network. Fleek Network accelerates, caches, indexes, and replicates content. The underlying storage is protocol agnostic, using the IPLD structure, with IPFS, Filecoin, and traditional http supported.',
    duration: 'September 2022 - Present',
    stack: [
      'Rust',
      'libp2p',
      'IPFS',
      'Narwhal / Bullshark',
      'terraform',
      'docker',
    ],
    link: 'https://fleek.network/',
  },
  {
    name: 'Psychedelic DAO',
    title: 'Fullstack Developer',
    description:
      'A decentralized product studio focused on building Web3 products. Worked on core infrastructure projects like CAP (asset permanence/verifiable history), the ic-kit sdk, Plug wallet, and more. Lead the development of the Jelly.xyz decentralized NFT marketplace protocol.',
    duration: 'Feb 2022 - November 2022',
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

const skills = [
  'Rust,',
  'Docker / CI,',
  'Terraform,',
  'Golang,',
  'C (#),',
  'Web,',
  'React.js',
]

const contact = {
  email: 'self@ossian.dev',
}

export { header, about, projects, experiences, skills, contact }
