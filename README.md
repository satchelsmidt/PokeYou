# PokeYou

PokeYou is an app that allows a user to upload an image of themselves, and then matches them with the pokemon that most resembles their features. The app uses the FaceAPI to store users face images, record a number of metrics on each face, and group the user face into a distinct emotional category. Each emotional category corresponds with a subset of the original 150 Pokemon, one of which is returned as a match to the user. 

# About

PokeYou is built on HTML/CSS/Javascript with the Bootstrap framework. Additionally, use uploaded images are stored on Cloudinary, retrieved via Axios calls, and then input into the FaceAPI for tracking. The app also uses the open source PokeApi to retrieve Pokemon statistics, data, and images. 
