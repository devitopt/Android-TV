import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  Dimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS from 'react-native-fs';

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

function Button(props) {
  return (
    <View style={bstyle.container}>
      <Image source={props.src} />
    </View>
  );
}

function ProgressBar(props) {
  return (
    <View style={pstyle.container}>
      <View style={[pstyle.progressed, {width: props.percent + '%'}]} />
    </View>
  );
}

function AppItem(props) {
  const [percentage, setPercentage] = useState(0);
  const isAvailable = () => {
    return props.title.includes(props.search);
  };
  const downloadFile = () => {
    if (percentage == 100) return;
    RNBackgroundDownloader.download({
      id: props.key,
      url: props.link,
      destination: `${RNFS.DownloadDirectoryPath}/${props.title}.apk`,
    })
      .begin(expectedBytes => {
        console.log(`Going to download ${expectedBytes} bytes!`);
      })
      .progress(percent => {
        console.log(`Downloaded: ${percent * 100}%`);
        setPercentage(percent * 100);
      })
      .done(() => {
        console.log('Download is done!');
        setPercentage(100);
      })
      .error(error => {
        console.log('Download canceled due to error: ', error);
        setPercentage(0);
      });
  };
  return (
    <View style={[astyle.container, isAvailable() ? {} : {display: 'none'}]}>
      <View style={mstyle_p.spaceBetween}>
        <Image style={astyle.image} source={props.src} />
        <TouchableNativeFeedback onPress={downloadFile} useForeground={true}>
          <View style={bstyle.container}>
            <Button src={require('../assets/download.png')} />
          </View>
        </TouchableNativeFeedback>
      </View>
      <Text style={astyle.title}>{props.title}</Text>
      <View style={mstyle_p.spaceBetween}>
        <Text style={astyle.date}>Modified at: {props.date}</Text>
        <View style={astyle.progressBarWrapper}>
          <ProgressBar percent={percentage} />
        </View>
      </View>
      <View style={astyle.bottomLine} />
    </View>
  );
}

export default function WelcomeScreen({navigation}) {
  const [data, setData] = useState([]);
  const [searchStr, setSearchStr] = useState('');
  const [bPortrait, setPortrait] = useState(isPortrait());
  useEffect(() => {
    const getApksFromApi = async () => {
      let response = await fetch(
        'https://yhdevfull.com/apkdownloader/api/GetApkList',
        {
          method: 'GET',
          headers: {
            'x-api-key': '4ste235-c207-4f7a-9949-7a7dfewr679',
          },
        },
      );
      let json = await response.json();
      setData(json.data);
    };
    getApksFromApi();

    // const callback = () => setPortrait(isPortrait());
    // Dimensions.addEventListener('change', callback);
    // return () => {
    //   Dimensions.removeEventListener('change', callback);
    // };
  }, []);
  return bPortrait ? (
    <View style={mstyle_p.container}>
      <View style={mstyle_p.header}>
        <View style={mstyle_p.logoWrapper}>
          <Image style={mstyle_p.logo} source={require('../assets/logo.png')} />
        </View>
        <Text style={mstyle_p.caption}>APPS</Text>
        <View style={mstyle_p.spaceBetween}>
          <View style={mstyle_p.inputWrapper}>
            <TextInput
              style={mstyle_p.searchInput}
              placeholder="Search files"
              value={searchStr}
              onChangeText={setSearchStr}
              placeholderTextColor="#CDCDCD"
            />
          </View>
          <Button src={require('../assets/search.png')} />
        </View>
      </View>
      <ScrollView style={mstyle_p.appStore}>
        {data.map(item => (
          <AppItem
            key={item.id}
            link={item.link}
            src={{uri: item.logo}}
            title={item.name}
            search={searchStr}
            date={item.modified_date}
          />
        ))}
      </ScrollView>
    </View>
  ) : (
    <View style={mstyle_l.container}>
      <View style={mstyle_l.header}>
        <View style={mstyle_l.logoWrapper}>
          <Image style={mstyle_l.logo} source={require('../assets/logo.png')} />
        </View>
        <View style={mstyle_l.rightBar}>
          <View style={mstyle_l.captionWrapper}>
            <Text style={mstyle_l.caption}>APPS</Text>
          </View>
          <View style={mstyle_l.spaceBetween}>
            <View style={mstyle_l.inputWrapper}>
              <TextInput
                style={mstyle_l.searchInput}
                placeholder="Search files"
                value={searchStr}
                search={searchStr}
                onChangeText={setSearchStr}
                placeholderTextColor="#CDCDCD"
              />
            </View>
            <Button src={require('../assets/search.png')} />
          </View>
        </View>
      </View>
      <ScrollView style={mstyle_l.appStore}>
        <View style={mstyle_l.scrollArea}>
          {data.map(item => (
            <View key={item.id} style={[mstyle_l.appWrapper, item.name.includes(searchStr) ? {} : {display: 'none'}]}>
              <AppItem
                key={item.id}
                link={item.link}
                src={{uri: item.logo}}
                title={item.name}
                search={searchStr}
                date={item.modified_date}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const mstyle_p = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#303030',
    padding: 8,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#424242',
    padding: 8,
  },
  logoWrapper: {
    width: '30%',
    height: undefined,
    aspectRatio: 6 / 4,
    marginVertical: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  spaceBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  searchInput: {
    fontSize: 16,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#CDCDCD',
  },
  appStore: {
    flex: 1,
    width: '100%',
  },
});

const mstyle_l = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#303030',
    padding: 16,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#424242',
    padding: 16,
  },
  logoWrapper: {
    width: '20%',
    height: undefined,
    aspectRatio: 6 / 4,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rightBar: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  captionWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  caption: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  spaceBetween: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  searchInput: {
    fontSize: 16,
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#CDCDCD',
  },
  appStore: {
    flex: 1,
    width: '100%',
  },
  scrollArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  appWrapper: {
    width: '48%',
  },
});

const bstyle = StyleSheet.create({
  container: {
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: '#606060',
  },
});

const astyle = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  image: {
    width: undefined,
    height: 64,
    aspectRatio: 1 / 1,
  },
  progressBarWrapper: {
    flex: 1,
    paddingLeft: 8,
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginVertical: 12,
  },
  date: {
    color: 'white',
    fontSize: 12,
  },
  bottomLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#606060',
    marginTop: 6,
  },
});

const pstyle = StyleSheet.create({
  container: {
    width: '100%',
    height: 16,
    backgroundColor: '#606060',
  },
  progressed: {
    height: '100%',
    backgroundColor: '#A0A0A0',
  },
});
