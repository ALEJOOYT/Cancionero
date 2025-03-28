import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
  StyleSheet
} from 'react-native';
export default function App() {
  const [canciones, setCanciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch songs from API
  useEffect(() => {
    console.log('useEffect is being called - initializing fetch');

    const fetchCanciones = async () => {
      try {
        const response = await fetch('http://cancionero-production.up.railway.app/api/canciones');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetch succeeded, data received: ', data);
        setCanciones(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError('Failed to load songs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCanciones();

    // Polling every 30 seconds for new songs (optional)
    const interval = setInterval(fetchCanciones, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Open song detail modal
  const handleOpenSongDetail = (song) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  // Close song detail modal
  const handleCloseSongDetail = () => {
    setModalVisible(false);
    setSelectedSong(null);
  };

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading songs...</Text>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            // This will trigger the useEffect to run again
          }}>
          <Text style={styles.tryAgainButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  console.log('Rendering component, current canciones state: ', canciones);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Cancionero
        </Text>
      </View>

      {/* Song List */}
      <ScrollView style={styles.scrollContainer}>
        {canciones.length > 0 ? (
          canciones.map((cancion) => (
            <TouchableOpacity
              key={cancion.id}
              style={styles.songCard}
              onPress={() => handleOpenSongDetail(cancion)}
            >
              <View style={styles.songCardInner}>
                <View style={styles.songCardContent}>
                  <Text style={styles.songTitle}>{cancion.titulo}</Text>
                  <Text style={styles.songArtist}>{cancion.artista}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No songs available. Add some songs to get started!
            </Text>
          </View>
        )}
      </ScrollView>
      {/* Song Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseSongDetail}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedSong && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedSong.titulo}</Text>
                  <TouchableOpacity
                    onPress={handleCloseSongDetail}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalArtist}>
                  {selectedSong.artista}
                </Text>

                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalLyrics}>
                    {selectedSong.letra}
                  </Text>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Text style={styles.modalLyrics}>
        Made by Izai Alejandro Zalles Merino
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  tryAgainButton: {
    marginTop: 24,
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#4f46e5',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  songCard: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  songCardInner: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  songCardContent: {
    padding: 16,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  songArtist: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    backgroundColor: '#e5e7eb',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalArtist: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6366f1',
    marginBottom: 16
  },
  modalScrollView: {
    marginTop: 8
  },
  modalLyrics: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563'
  }
});
