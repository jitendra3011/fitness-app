import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Platform } from "react-native";
import * as Location from "expo-location";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function EnduranceRunScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState(0); // meters
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // seconds
  const [avgSpeed, setAvgSpeed] = useState(0); // km/h

  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const prevLocation = useRef<Location.LocationObject | null>(null);

  const startRun = async () => {
    setIsRunning(true);
    setDistance(0);
    setElapsedTime(0);
    setAvgSpeed(0);
    setStartTime(Date.now());

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    watchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1,
      },
      (loc) => {
        if (prevLocation.current) {
          const d = getDistance(prevLocation.current.coords, loc.coords);
          setDistance((prev) => prev + d);
        }
        prevLocation.current = loc;
      }
    );
  };

  const stopRun = async () => {
    setIsRunning(false);

    if (watchRef.current) {
      // Only call remove() on mobile (iOS/Android)
      if (Platform.OS !== "web") {
        await watchRef.current.remove();
      }
      watchRef.current = null;
    }

    prevLocation.current = null;
    setStartTime(null);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      timer = setInterval(() => {
        if (startTime !== null) {
          const seconds = Math.floor((Date.now() - startTime) / 1000);
          setElapsedTime(seconds);

          if (distance > 0 && seconds > 0) {
            const speed = (distance / 1000) / (seconds / 3600); // km/h
            setAvgSpeed(Number(speed.toFixed(2)));
          }
        }
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, distance, startTime]);

  const getDistance = (
    c1: Location.LocationObjectCoords,
    c2: Location.LocationObjectCoords
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371e3;

    const dLat = toRad(c2.latitude - c1.latitude);
    const dLon = toRad(c2.longitude - c1.longitude);
    const lat1 = toRad(c1.latitude);
    const lat2 = toRad(c2.latitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Endurance Run</ThemedText>
      <ThemedText type="default">Track your distance and speed.</ThemedText>

      <ThemedText type="default">
        Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
      </ThemedText>
      <ThemedText type="default">
        Distance: {(distance / 1000).toFixed(2)} km
      </ThemedText>
      <ThemedText type="default">
        Avg Speed: {avgSpeed} km/h
      </ThemedText>

      {!isRunning ? (
        <Button title="Start Run" onPress={startRun} />
      ) : (
        <Button title="Stop Run" onPress={stopRun} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    justifyContent: "center",
  },
});
 







// import { useState, useEffect, useRef } from "react";
// import { Button } from "react-native";
// import { StyleSheet } from "react-native";
// import * as Location from "expo-location";
// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";

// export default function EnduranceRunScreen() {
//   const [isRunning, setIsRunning] = useState(false);
//   const [distance, setDistance] = useState(0); // meters
//   const [startTime, setStartTime] = useState<number | null>(null);
//   const [elapsedTime, setElapsedTime] = useState(0); // seconds
//   const [avgSpeed, setAvgSpeed] = useState(0); // km/h
//   const watchRef = useRef<Location.LocationSubscription | null>(null);
//   const prevLocation = useRef<Location.LocationObject | null>(null);

//   // Start Run
//   const startRun = async () => {
//     setIsRunning(true);
//     setDistance(0);
//     setElapsedTime(0);
//     setAvgSpeed(0);
//     setStartTime(Date.now());

//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       alert("Permission to access location was denied");
//       return;
//     }

//     watchRef.current = await Location.watchPositionAsync(
//       { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
//       (loc) => {
//         if (prevLocation.current) {
//           const d = getDistance(
//             prevLocation.current.coords,
//             loc.coords
//           );
//           setDistance((prev) => prev + d);
//         }
//         prevLocation.current = loc;
//       }
//     );
//   };

//   // Stop Run
//   const stopRun = () => {
//     setIsRunning(false);
//     if (watchRef.current) {
//       watchRef.current.remove();
//       watchRef.current = null;
//     }
//     prevLocation.current = null;
//   };

//   // Track elapsed time
//   useEffect(() => {
//     let timer: ReturnType<typeof setInterval> | undefined;
//     if (isRunning) {
//       timer = setInterval(() => {
//         if (startTime !== null) {
//           const seconds = Math.floor((Date.now() - startTime) / 1000);
//           setElapsedTime(seconds);

//           // calculate avg speed (km/h)
//           if (distance > 0 && seconds > 0) {
//             setAvgSpeed(Number(((distance / 1000) / (seconds / 3600)).toFixed(2)));
//           }
//         }
//       }, 1000);
//     }
//     return () => {
//       if (timer) clearInterval(timer);
//     };
//   }, [isRunning, distance]);

//   // Helper: Haversine formula (distance in meters)
//   const getDistance = (c1: Location.LocationObjectCoords, c2: Location.LocationObjectCoords) => {
//   const toRad = (x: number) => (x * Math.PI) / 180;
//   const R = 6371e3; // Earth radius in m
//   const dLat = toRad(c2.latitude - c1.latitude);
//   const dLon = toRad(c2.longitude - c1.longitude);
//   const lat1 = toRad(c1.latitude);
//   const lat2 = toRad(c2.latitude);

//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// };

//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText type="title">Endurance Run</ThemedText>
//       <ThemedText type="default">Track your distance and speed.</ThemedText>

//       <ThemedText type="default">
//         Time: {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
//       </ThemedText>
//       <ThemedText type="default">
//         Distance: {(distance / 1000).toFixed(2)} km
//       </ThemedText>
//       <ThemedText type="default">
//         Avg Speed: {avgSpeed} km/h
//       </ThemedText>

//       {!isRunning ? (
//         <Button title="Start Run" onPress={startRun} />
//       ) : (
//         <Button title="Stop Run" onPress={stopRun} />
//       )}
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     gap: 12,
//     justifyContent: "center",
//   },
// });




// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { StyleSheet } from 'react-native';

// export default function EnduranceRunScreen() {
//     return (
//         <ThemedView style={styles.container}>
//             <ThemedText type="title">Endurance Run</ThemedText>
//             <ThemedText type="default">Build upper body strength.</ThemedText>
//         </ThemedView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         gap: 8,
//     },
// });


