class Country{
    constructor({name='', capital='', timeZones='', flagUrl='', population=''}) {
        this.name = name;
        this.capital = capital;
        this.timeZones = timeZones;
        this.flagUrl = flagUrl;
        this.population = population;
    }

    clone(){
        return new Country({
            'name': this.name,
            'capital': this.capital,
            'timeZones': this.timeZones,
            'flagUrl': this.flagUrl,
            'population': this.population
        })
    }
}

// var countrySearch = document.forms['myForm']['name'];  

let countries = [];

function test(){
    console.log(document.getElementById('countrySearch').value); // fonctionne mais ne l'affiche qu'une fraction de seconde dans la console
}

async function getCountries(){
    var countrySearch = document.getElementById('countrySearch').value;

    countries = [];
    try{
        if(countrySearch != ""){
            const response = await fetch('https://restcountries.com/v2/name/' + countrySearch);
            const json = await response.json();
            for (let country of json) {            
                console.log(country);
                let countryObj = new Country({name: country.name, capital: country.capital, timeZones: country.timezones, flagUrl: country.flag, population: country.population});
                countries.push(countryObj);
            };
        } else {
            const response = await fetch('https://restcountries.com/v2/all');
            const json = await response.json();
            for (let country of json) {            
                console.log(country);
                let countryObj = new Country({name: country.name, capital: country.capital, timeZones: country.timezones, flagUrl: country.flag, population: country.population});
                countries.push(countryObj);
            };
        }
    } catch (e){
        console.error(e);
    }
}

function formateTimeZones(country){
    let timeZones = "";
    Object.values(country.timeZones).forEach(timeZone => {
        if(timeZones != ""){
        timeZones += ", ";
        }
        timeZones += timeZone;
    });
    return timeZones;
}

function showCountries(){
    document.getElementById("countries").innerHTML = "";
    if (countries.length > 0) {
        for (let country of countries) {
            let country_card = document.createElement("div");
            country_card.classList.add("country-card");

            let country_card_content = document.createElement("div");
            country_card_content.classList.add("country-card-content");
            country_card.appendChild(country_card_content);

            let flag = document.createElement("div");
            flag.classList.add("flag");
            country_card_content.appendChild(flag);

            let flagImg = document.createElement("img");
            flagImg.setAttribute("src", country.flagUrl);
            flag.appendChild(flagImg);

            let infos = document.createElement("div");
            infos.classList.add("infos");
            country_card_content.appendChild(infos);

            let country_name = document.createElement("div");
            country_name.classList.add("country-name");
            country_name.innerText = country.name;
            infos.appendChild(country_name);

            let time_zones = document.createElement("div");
            time_zones.classList.add("time-zones");
            time_zones.innerText = (country.timeZones.length > 1 ? "Time Zones" : "Time Zone") + " : " + "???";
            infos.appendChild(time_zones);

            let population = document.createElement("div");
            population.classList.add("population");
            country_card_content.appendChild(population);

            let populationIcon = document.createElement("span");
            populationIcon.classList.add("material-icons");
            populationIcon.innerText = "people";
            population.appendChild(populationIcon);
            
            document.getElementById("countries").appendChild(country_card);
        }
    } else {
        document.getElementById("countries").innerText = "Aucun résultat trouvé";
    }
}

document.getElementById("search").onclick = async function(){
    await getCountries(document.getElementById("countrySearch").value);
    showCountries();
}
