function showdata() {

    const query = `
query upcomingTournaments{
upcomingTournaments {
...TournamentCard
}
}
fragment TournamentCard on TournamentCard {
alias
tournamentType
tournamentStatus
bracketType
teamSize
maxTeams
deadline
name
token {
name
symbol
chain
}
game {
url
name
}
thumbnail
}
`;



    fetch('https://web.prod.daory.net/graphql', {
        method: "POST",
        headers: {
            'User-Agent': 'sjAyrfBtt6YcLnoU31IsbyMcxaV1lM'
        },
        body: JSON.stringify({
            query
        })

    }).then(response => {
        return response.json()
    }).then(data => {

        const valuesbeforeup = Object.values(data)
        valuesbeforeup.forEach(element1 => {

            console.log(element1)
        })

    })
}


showdata()