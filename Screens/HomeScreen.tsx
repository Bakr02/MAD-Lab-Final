import { View, Text, TextInput, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import tw from 'twrnc';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import Artworks from '../components/arts';

interface Artwork {
  aCategory: string;
  aName?: string; // Property to handle potential undefined names
  // add other artwork properties here
}

export default function HomeScreen() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const artsRef = dbRef(db, 'arts');
    const unsubscribe = onValue(artsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const artList = Object.keys(data).map((key) => data[key]);
        console.log('Fetched artworks:', artList);
        setArtworks(artList);
        setFilteredArtworks(artList); // Initialize with all artworks
      } else {
        setArtworks([]);
        setFilteredArtworks([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = artworks.filter((art) =>
        art.aName && art.aName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArtworks(filtered);
    } else {
      setFilteredArtworks(artworks);
    }
  }, [searchQuery, artworks]);


  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }} // Tailwind equivalent of paddingBottom: 50
        style={tw`mb-6 pt-14`} // Tailwind equivalent of marginTop: 6, paddingTop: 14
      >
        <View style={tw`mx-4 flex-row justify-between items-center mb-2`}>
          <Image
            source={require('../assets/artify-logo.png')}
            style={{ height: hp(5), width: hp(5.5), marginTop: 6 }}
          />
          <BellIcon size={hp(4)} color="gray" />
        </View>

        <View style={{ paddingLeft: 15 }}>
          <Text style={[{ fontSize: hp(3.8) }, tw`font-semibold text-neutral-600`]}>
            Discover and showcase
          </Text>
          <Text style={[{ fontSize: hp(3.8) }, tw`font-semibold text-neutral-600 text-pink-600`]}> the art you love</Text>
          <Text style={[{ fontSize: hp(3.8) }, tw`font-semibold text-neutral-600`]}>-all at one place
          </Text>
        </View>

        {/* Search Bar */}
        <View style={tw`mt-4 mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]`}>
          <TextInput 
            placeholder='Search any art'
            placeholderTextColor={'gray'}
            style={[{ fontSize: hp(1.7) }, tw`flex-1 text-base mb-1 pl-3 tracking-wider`]}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <View style={tw`bg-white rounded-full p-3`}>
            <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
          </View>
        </View>

        {/* Artworks */}
        <View>
          {filteredArtworks.length > 0 ? (
            <Artworks arts={filteredArtworks} categories={undefined} />
          ) : (
            <Text style={tw`text-center mt-4`}>No artworks found</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
