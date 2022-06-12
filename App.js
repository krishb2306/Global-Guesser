/*
This is my Global Guesser App. I themed it after national parks so I called it the Park Guesser. It works pretty basically, but
once you open the app you can click on the instructions, which shows a modal containing it. Once you press play, you are brought to the 
game screen. On the game screen you just tap where you want your marker to be, and after you are happy with the placement you can press check.

The check button does not work if you dont have a marker down, this makes it so you cant break that part. Once you check you will see another
map which has your marker, and the correct marker, alongside a line between the two. On the top you have the amount of points you earned
out of 5000 and you have a progress bar to visually show how close you were. Under the map there is the name of the park and how far away
you guessed in KM. 

Once you finish the game, another Modal will popup, which has information about your scoring. It shows your round score, last score, and best score.
You can then press play again, to try and get a better score. The images are the same so you should be getting a much better score.

The top of the game screen has your current round out of 10 and total points.

There should be no bugs on the app

As a side note I still havent fixed the issue at home with the expo go app, so I wasnt able to fully test on Android, but from what I did
in class everything should be sized nicely, and all of the custom font should be showing.
*/

import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, Pressable, TouchableOpacity, ImageBackground, Image, SafeAreaView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView, { Polyline } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import * as Progress from 'react-native-progress';

function HomeScreen({navigation}) {
  const[modalOpen, setModal] = useState(false)

  const [loaded] = useFonts({
    Space: require('./assets/Fonts/nasa.otf'),//custom font
  });
  if (!loaded) {
    return <AppLoading/>;
  } else {
  return (

    <View style={styles.container}>
      <ImageBackground source={require('./assets/background.jpeg')} style={styles.image}>
      <SafeAreaView style = {styles.safeAreaStyle}>

      <View style={styles.titleContainer}>
      <Text style = {styles.mainFont}>PARK</Text>
      <Text style = {styles.mainFont}>GUESSER</Text>
      </View>

      <View style={styles.homeScreenSpacer}>
      
      </View>

      <View style={styles.homeButtons}>
      <TouchableOpacity
      style = {styles.homeButtonStyle} 
        
        onPress={() => {navigation.navigate('Game');}}
      >
        <Text style = {styles.homeButtonText}>PLAY</Text>
        </TouchableOpacity>
        <TouchableOpacity
      style = {styles.homeButtonStyle} 
        
        onPress={() => {setModal(true)}}
      >
        <Text style = {styles.homeButtonText}>INSTRUCTIONS</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalOpen}
        >
           <View style={styles.centeredView}>
            <View style={styles.instructModal}>
              <Text style={styles.modalText}>The goal is to guess on the map, where you think the image above was taken. You can press check to see how far you were and you will recieve more points the closer you get. Press play when ready.</Text>
              <Pressable
                style={[styles.instructModalButton, styles.buttonClose]}
                onPress={() => setModal(false)}
              >
                <Text style={styles.modalButtonTextStyle}>GOT IT!</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>

    </SafeAreaView>
    </ImageBackground>
    </View>
    
    
  );
}
}

function GameScreen({navigation}) {
  useEffect(() => {
    if(open == true){
      shuffle(items)
      setOpen(false)
    }
  },[]);
  const[open,setOpen] = useState(true);

  const locations = [
    {name: "Yosemite National Park", source: require('./assets/yosemite.jpeg'), lat: 37.865101, long: -119.538330},
    {name: "Mammoth Cave", source: require('./assets/mammoth.jpeg'), lat: 37.186989, long: -86.100540},
    {name: "Yellowstone National Park", source: require('./assets/yellowstone.webp'), lat: 44.423691, long: -110.588516},
    {name: "Arches National Park", source: require('./assets/arches.webp'), lat: 38.733082, long:  -109.592514},
    {name: "Acadia National Park", source: require('./assets/acadia.jpeg'), lat: 44.338974, long: -68.273430},
    {name: "Sequoia National Park", source: require('./assets/sequoia.jpeg'), lat: 36.486366, long: -118.565750},
    {name: "Smoky Mountains", source: require('./assets/smoky.webp'), lat: 35.611763, long: -83.489548},
    {name: "Everglades National Park", source: require('./assets/everglades.webp'), lat: 25.286615, long: -80.898651},
    {name: "Rocky Mountains", source: require('./assets/rocky.jpeg'), lat:  40.343182, long: -105.688103},
    {name: "Glacier Mountains", source: require('./assets/glacier.jpeg'), lat: 48.6960847, long: -113.8070624},
  ]
  const[count, setCount] = useState(0)
  const[pointsEarned, setPoints] = useState(0)
  const[distanceKM, setDistanceKM] = useState(0)
  const[roundNumber, setNumber] = useState(1)
  const[gameModal, setModal] = useState(false)
  const[scoringModal, setModalTrue] = useState(false)
  const[buttonOn, setButton] = useState(true)
  const[lineOn, setLine] = useState(false)
  const[items, setItems] = useState(locations)
  const[state, setState] = useState({marker: null});
  const[score, setScore] = useState(0);
  const[lastScore, setLast] = useState(0);
  const[highScore, setHigh] = useState(0);
  const[show, setShow] = useState(false);

  function shuffle(items){
    setItems(items.sort(() => Math.random() - 0.5))
  }

  function distance() {
    const R = 6371e3; 
    const userLat = state.marker.latitude * Math.PI/180; 
    const answerLat = items[count].lat * Math.PI/180;
    const firstCoord = (items[count].lat-state.marker.latitude) * Math.PI/180;
    const secondCoord = (items[count].long- state.marker.longitude) * Math.PI/180;

    const a = Math.sin(firstCoord/2) * Math.sin(firstCoord/2) +
        Math.cos(userLat) * Math.cos(answerLat) *
        Math.sin(secondCoord/2) * Math.sin(secondCoord/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c / 1000; // km
    return Math.round(d);

  }
 
  function check() {
    if(count == 9){
      setModalTrue(true)
      setCount(9)
      setNumber(10)
    }
    else{
      setCount(count +1)
      setNumber(roundNumber + 1)
    }
    if(highScore < score){
      setHigh(score)
    }
  }
  return (

    <View style={styles.container}>
      <ImageBackground source={require('./assets/background.jpeg')} style={styles.image}>
      <SafeAreaView style = {styles.safeAreaStyle}>

      <View style = {styles.gameScore}>
        <View style = {styles.scoreBoxStyle}>
        <Text style = {styles.scoreText}>{roundNumber}/10 : {score == 0 ? "0000" : score}</Text>
        </View>
      </View>
      <View style={styles.gameImageCont}>
      <Image
        style={styles.mainImage}
        source={items[count].source}
        
      />
      </View>

      <View style={styles.gameMapCont}>
      <MapView
        userInterfaceStyle='dark'
        style = {styles.mapStyle}
        onPress={(e) => {setState({marker: e.nativeEvent.coordinate}); setButton(false)}}
        initialRegion={{
          latitude: 37.0902,
          longitude: -95.7129,
          latitudeDelta: 50,
          longitudeDelta: 50,
        }}
        
        >

        {state.marker != null && lineOn == true && (

        <Polyline  
          coordinates={[
          { latitude: items[count].lat,longitude: items[count].long },
          { latitude: state.marker.latitude, longitude: state.marker.longitude },
        
          ]}
          strokeColor="black" 
          strokeWidth={2}
	    />)}
      
          {show && (
        <Marker
          pinColor='orange'
          coordinate={{ latitude : items[count].lat, longitude : items[count].long}}
          />
          )}
        {
          state.marker &&
          <MapView.Marker coordinate={state.marker}/>

        }
      </MapView>
      </View>

      <View style={styles.gameCheckButton}>
      <TouchableOpacity
      style = {styles.buttonStyle} 
      disabled = {buttonOn}  
      onPress={() => {setShow(true); setPoints(Math.round(5000/Math.pow((Math.E), (distance()/2000)))); setScore(score + Math.round(5000/Math.pow((Math.E), (distance()/2000)))); setLine(true); setDistanceKM(distance()); setModal(true);}}
      >
        <Text style = {styles.baseText}>CHECK</Text>
        </TouchableOpacity>
      </View>
      <Modal
          animationType="slide"
          transparent={true}
          visible={gameModal}
        >
           <View style={styles.centeredView}>
            <View style={styles.answerModal}>
              
              <View style = {styles.gameModalScore}> 
              
              <Text style = {styles.gameModalText}> {pointsEarned} points</Text>
              <Progress.Bar progress={pointsEarned/5000} width={335} color="orange"/>
              
              </View>
              <MapView
              userInterfaceStyle='dark'
              style = {styles.mapStyleTwo}
              initialRegion={{
                latitude: 37.0902,
                longitude: -95.7129,
                latitudeDelta: 50,
                longitudeDelta: 50,
              }}>
                
              
                <Marker
                pinColor='orange'
                coordinate={{ latitude : items[count].lat, longitude : items[count].long}}
                />
                {state.marker != null && lineOn == true && (
                <Polyline  
                coordinates={[
                { latitude: items[count].lat,longitude: items[count].long },
                { latitude: state.marker.latitude, longitude: state.marker.longitude },
        
                  ]}
                strokeColor="black" 
                trokeColors={[
                'black',
                ]}
                strokeWidth={2}
	              />)}
                {state.marker != null && lineOn == true && (
                <Marker
                pinColor='red'
                coordinate={{ latitude : state.marker.latitude, longitude : state.marker.longitude}}
                />)}
            </MapView>
            <View style = {styles.modalNameSection}>
              <Text style = {styles.gameModalText}> {items[count].name}</Text>
              <Text style = {styles.gameModalText}> {distanceKM} km off</Text>

              </View>
            <TouchableOpacity
              style = {styles.gameButtonStyle} 
        
              onPress={() => {setShow(false); setButton(true); check(); setModal(false); setLine(false); setState({marker: null})}}
              >
            <Text style = {styles.baseText}>NEXT</Text>
            </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={scoringModal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModal(false);
          }}
        >
           <View style={styles.centeredView}>
            <View style={styles.endGameView}>
              <Text style={styles.modalText}>Round Score: {score}</Text>
              <Text style={styles.modalText}>Last Score: {lastScore}</Text>
              <Text style={styles.modalText}>Best Score: {highScore}</Text>
              <Pressable
                style={[styles.instructModalButton, styles.buttonClose]}
                onPress={() => {setModalTrue(false); setCount(0); setNumber(1); setLast(score); setScore(0); shuffle(items)}}
              >
                <Text style={styles.modalButtonTextStyle}>PLAY AGAIN</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
    </ImageBackground>
    </View>
    
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  
  container: {
    flex: 1, 
    backgroundColor: "black",
    alignItems: 'center', 
    justifyContent: 'center'
  },
  titleContainer: {
    //backgroundColor: "red",
    flex: 0.35, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: "100%"
  },
  homeScreenSpacer: {
    //backgroundColor: "green",
    flex: 0.25, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: "100%"
  },
  homeButtons: {
    //backgroundColor: "orange",
    flex: 0.3, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: "100%"
  },
  safeAreaStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  tinyLogo: {
    width: 200,
    height: 200,
    resizeMode: "contain"
  },
  confImage: {
    width: 85,
    height: 100,
    marginLeft: 25,
    marginRight: 25,
    resizeMode: "contain",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    //opacity: 0.8,
    resizeMode: "contain"
  },
  gameImageCont: {
    //backgroundColor: "red",
    flex: 0.5, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: "100%",
  },
  
  gameMapCont: {
    //backgroundColor: "green",
    flex: 0.5, 
    alignItems: 'center', 
    justifyContent: 'center',
    width: "100%"
  },
  gameCheckButton: {
    flex: 0.1,
    //backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  mapStyle:{
    width: "100%",
    height: "90%",
    borderRadius: 25,
  },
  buttonStyle: {
    backgroundColor: "white",
    height: "60%",
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginRight: 40,
    marginLeft: 40,
    borderWidth: 1,
    borderColor: "black"
    
  },
  mainImage: {
    width: "100%",
    height: "90%",
    resizeMode: "cover",
    borderRadius: 25
  },
  baseText: {
    fontSize: 15,
    color: "#450920",
    fontFamily: "Space"
  },
  homeButtonStyle: {
    backgroundColor: "white",
    height: "20%",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    margin: 10
  },
  mainFont: {
    fontFamily: "Space",
    fontSize: 45,
    color: "white",
    margin: 5
  },
  homeButtonText: {
    fontSize: 15,
    fontFamily: "Space"
  },
  gameScore: {
    flex: 0.07,
    //backgroundColor: "red", 
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginTop: 10
  },
  scoreBoxStyle: {
    backgroundColor: "white",
    width: "50%",
    height: "80%",
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25
  },
  scoreText: {
    fontFamily: "Space",
    color:"black",
    fontSize: 25,
    marginTop: 3,
    marginLeft: 10,
  },
  mapStyleTwo:{
    width: "107%",
    height: "72%",
    borderRadius: 25,
  },



  gameButtonStyle: {
    backgroundColor: "white",
    height: "10%",
    width: "30%",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginRight: 40,
    marginLeft: 40,
    borderWidth: 1,
    borderColor: "black"
  },
  
  gameModalScore: {
    //backgroundColor: "red",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5
  },
  modalNameSection: {
    //backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    //marginBottom: 5
  },
  
  gameModalText: {
    fontWeight: "bold",
    color: "black",
    fontSize: 14,
    margin: 2.5
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 22
  },
  instructModal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    opacity: 0.8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  answerModal: {
    marginTop: "115%",
    backgroundColor: "white",
    height: windowHeight/2,
    width: "100%",
    margin: 20,
   //backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    opacity: 0.8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  endGameView: {
    margin: 20,
    width: "70%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    opacity: 0.8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    marginLeft: 50
  },
  instructModalButton: {
    borderRadius: 20,
    padding: 10,
  },
  buttonClose: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black"
  },
  modalButtonTextStyle: {
    color: "black",
    textAlign: "center",
    fontFamily: "Space"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "black",
    fontWeight: "bold"
  },
  modalButtonCont: {
    width: "43%",
    //backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
  },

  

})


export default App;