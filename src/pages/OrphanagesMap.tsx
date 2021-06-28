import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/map-marker.png';
import api from '../services/api';

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([])
  
  useFocusEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });

  }, [])

  const navigation = useNavigation();

  function handleNavigationToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', {id});
  }

  function handleNavigationToCreateOrphanage() {
    navigation.navigate('SelectMapPosition');
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -1.462262,
          longitude: -48.4714993,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        }}
      >
        {orphanages.map((orphanage, index) => {
          return (
            <Marker
              key={index}
              icon={mapMarker}
              calloutAnchor={{
                x: 2.7,
                y: 0.8
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude
              }}
            >
              <Callout tooltip={true} onPress={() => {handleNavigationToOrphanageDetails(orphanage.id)}}>
                <View style={styles.calloutContainer} >
                  <Text style={styles.calloutText} >{orphanage.name}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
        


      </MapView>

      <View style={styles.footer} >
      <Text style={styles.footerText} > {orphanages.length == 1 ? (<>{orphanages.length} orfanato encontrado</>) : (<>{orphanages.length} orfanatos encontrados</>) } </Text>
        <RectButton style={styles.createOrphanageButton} onPress={handleNavigationToCreateOrphanage} >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </RectButton>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height
    },
  
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center'
    },
  
    calloutText: {
      color: '#0089A5',
      fontSize: 14,
      fontFamily: 'Nunito_700Bold'
    },
  
    footer: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: '#FFF',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
      elevation: 1
    },
    
    footerText: {
      color: '#8FA7B3',
      fontFamily: 'Nunito_700Bold'
    },
  
    createOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15C3D6',
      borderRadius: 20,
  
      justifyContent: 'center',
      alignItems: 'center'
  
    }
  });
  