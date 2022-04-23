import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

export default function SplashScreen({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('WelcomeScreen');
    }, 700);
  }, []);
  return (
    <TouchableNativeFeedback
      onPress={() => navigation.navigate('WelcomeScreen')}>
      {isPortrait() ? (
        <View style={mstyle_p.container}>
          <Image
            style={mstyle_p.image}
            source={require('../assets/logo.png')}
          />
        </View>
      ) : (
        <View style={mstyle_l.container}>
          <Image
            style={mstyle_l.image}
            source={require('../assets/banner.jpg')}
          />
        </View>
      )}
    </TouchableNativeFeedback>
  );
}

const mstyle_p = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '50%',
    height: undefined,
    aspectRatio: 6 / 4,
  },
});

const mstyle_l = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
