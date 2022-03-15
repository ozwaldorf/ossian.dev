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
    name: 'Principal ID Bruteforce',
    description:
      'Bruteforce generate principal ids with a human readable prefix',
    stack: ['shell', 'dfx', 'plugwallet'],
    sourceCode: 'https://github.com/ozwaldorf/principal_bruteforce',
  },
  {
    name: 'Cipherproxy',
    description: 'An project I donate a little bit of time to',
    stack: ['Unity', 'C#', 'Web', 'Blockchain'],
    sourceCode: '',
  },
  {
    name: 'upld.is',
    description: 'A free to use pastebin for the command line',
    stack: ['Golang', 'Pastebin', 'Command Line Utility'],
    sourceCode: '',
    link: 'https://upld.is',
  },
  {
    name: 'Tidalwave / API',
    description: 'Api in golang for Tidal, the music streaming platform',
    stack: ['Golang', 'REST', 'Encryption'],
    sourceCode: 'https://github.com/ozwaldorf/tidal',
  },
  {
    name: 'Arbicrypt LLC ',
    description:
      'Arbitrage crypto trading platform, project was abandoned due to oversaturation',
    stack: ['Golang', 'WebSockets', 'Blockchain'],
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
    name: 'Psychedelic DAO / Fleek.co',
    title: 'Fullstack Developer',
    description:
      'A decentralized product studio focused on building Web3 products.',
    duration: 'Feb 2022 - Present',
    stack: ['Rust', 'Internet Computer', 'Web3'],
    link: 'https://psychedelic.ooo',
  },
]

const skills = ['Rust', 'Golang', 'C (#)', 'Web', 'React.js']

const contact = {
  email: 'self@ossian.dev',
}

export { header, about, projects, experiences, skills, contact }
