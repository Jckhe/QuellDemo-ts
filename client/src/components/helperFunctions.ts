interface querySamples {
  [selectedQuery: string]: string
}

export const querySamples: querySamples = {
  '2depth': `query {
    artist(name: "Frank Ocean") {
      id
      name
      albums {
        id
        name
      }
    }
  }`,

  'costly': `query {
    artist(name: "Frank Ocean") {
        id
        name
        albums {
            id
            name 
            songs {
                id
                name
                artist {
                    id
                    name
                }
            }
        }
    }
    song(name: "September") {
        id
        name
        album {
            artist {
                id
                name
                albums {
                    songs {
                        name
                    }
                }
            }
        }
    }
}`, 
}