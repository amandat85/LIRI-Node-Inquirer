//REQUIRE ===========================================================================================================================
require("dotenv").config();
const keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let axios = require("axios");
let moment = require("moment");
let inquirer = require("inquirer")
let fs = require("fs");

//SEARCH OPTIONS ====================================================================================================================
inquirer.prompt([
    {
        type: "list",
        message: "What would you like to search?",
        choices: ["Movie", "Song", "Band/Artist", "Do What it Says"],
        name: "searchOptions",
    }
])
    .then(function (inquirerResponse) {
        //MOVIE SEARCH ==============================================================================================================
        if (inquirerResponse.searchOptions.slice() === "Movie") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Which movie would would you like to search?",
                    name: "movie",
                    default: "Mr. Nobody"
                }
            ])
                .then(function (inquirerResponse) {
                    axios.get("http://www.omdbapi.com/?t=" + inquirerResponse.movie + "&y=&plot=short&apikey=trilogy")
                        .then(function (response) {
                            let = movieResults = "--------------------------------------------------------------------" +
                                "\nTitle " + response.data.Title +
                                "\nYear: " + response.data.Year +
                                "\nIMDB Rating: " + response.data.Ratings[0].Value +
                                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                                "\nCountry: " + response.data.Country +
                                "\nLanguage: " + response.data.Language +
                                "\nPlot: " + response.data.Plot +
                                "\nActors/Actresses " + response.data.Actors +
                                "\n--------------------------------------------------------------------";
                            console.log(movieResults);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
        }
        //SONG SEARCH================================================================================================================
        else if (inquirerResponse.searchOptions.slice() === "Song") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Which song would you like information about?",
                    name: "song",
                    default: "The Sign:Ace of Base"
                }
            ])
                .then(function (inquirerResponse) {
                    spotify.search({
                        type: "artist,track",
                        query: inquirerResponse.song,
                    }, function (err, response) {
                        if (err) {
                            return console.log("Error occurred: " + err);
                        }
                        let songResults = "----------------------------------------------------------------" +
                            "\nArtist(s): " + response.tracks.items[0].artists[0].name +
                            "\nSong Name: " + response.tracks.items[0].name +
                            "\nAlbum Name: " + response.tracks.items[0].album.name +
                            "\nPreview Link: " + response.tracks.items[0].external_urls.spotify +
                            "\n--------------------------------------------------------------------";
                        console.log(songResults);
                    })
                })
        }
        //BAND/ARTIST CONCERT SEARCH ================================================================================================
        else if (inquirerResponse.searchOptions.slice() === "Band/Artist") {
            inquirer.prompt([
                {
                    type: "input",
                    message: "Which band or artist would you like information about?",
                    name: "band",
                    default: "Drake"
                }
            ])
                .then(function (inquirerResponse) {
                    axios.get("https://rest.bandsintown.com/artists/" + inquirerResponse.band + "/events?app_id=codingbootcamp")
                        .then(function (response) {
                            for (var i = 0; i < 5; i++) {
                                let concertResults = "--------------------------------------------------------------------" +
                                    "\nVenue Name: " + response.data[i].venue.name +
                                    "\nVenue Location: " + response.data[i].venue.city +
                                    "\nDate of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
                                    "\n--------------------------------------------------------------------";
                                console.log(concertResults);
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
        }
        //DO WHAT IT SAYS ==========================================================================================================
        else if (inquirerResponse.searchOptions.slice() === "Do What it Says") {
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                let dataArr = data.split(","); spotify.search({
                    type: "artist,track",
                    query: dataArr[1],
                }, function (err, response) {
                    if (err) {
                        return console.log("Error occurred: " + err);
                    }
                    let songResults = "----------------------------------------------------------------" +
                        "\nArtist(s): " + response.tracks.items[0].artists[0].name +
                        "\nSong Name: " + response.tracks.items[0].name +
                        "\nAlbum Name: " + response.tracks.items[0].album.name +
                        "\nPreview Link: " + response.tracks.items[0].external_urls.spotify +
                        "\n--------------------------------------------------------------------";
                    console.log(songResults);
                })
            })
        }
    })