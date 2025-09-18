import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

type RegisteredInfo = {
    fullName: string;
    email: string;
    phone: string;
};

export default function ProfileScreen() {
    const registeredInfo: RegisteredInfo = useMemo(() => ({
        fullName: 'Alex Johnson',
        email: 'alex.j@example.com',
        phone: '123-456-7890',
    }), []);

    const [weight, setWeight] = useState<string>('');
    const [weightTouched, setWeightTouched] = useState<boolean>(false);
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [height, setHeight] = useState<string>('');
    const [heightTouched, setHeightTouched] = useState<boolean>(false);
    const [age, setAge] = useState<string>('');
    const [ageTouched, setAgeTouched] = useState<boolean>(false);
    const [gender, setGender] = useState<string>('');
    const [genderTouched, setGenderTouched] = useState<boolean>(false);
    const [city, setCity] = useState<string>('');
    const [cityTouched, setCityTouched] = useState<boolean>(false);
    const [regionState, setRegionState] = useState<string>('');
    const [regionStateTouched, setRegionStateTouched] = useState<boolean>(false);
    const [village, setVillage] = useState<string>('');
    const [villageTouched, setVillageTouched] = useState<boolean>(false);

    const weightError = useMemo(() => {
        if (!weightTouched) return '';
        if (!weight.trim()) return 'Weight is required.';
        const num = Number(weight);
        if (!Number.isFinite(num) || num <= 0) return 'Enter a valid positive number.';
        return '';
    }, [weight, weightTouched]);

    const pickImage = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your photos to select an image.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setPhotoUri(result.assets[0]?.uri ?? null);
        }
    }, []);

    const heightError = useMemo(() => {
        if (!heightTouched) return '';
        if (!height.trim()) return 'Height is required.';
        const num = Number(height);
        if (!Number.isFinite(num) || num <= 0) return 'Enter a valid positive number.';
        return '';
    }, [height, heightTouched]);

    const ageError = useMemo(() => {
        if (!ageTouched) return '';
        if (!age.trim()) return 'Age is required.';
        const num = Number(age);
        if (!Number.isInteger(num) || num <= 0) return 'Enter a valid age.';
        return '';
    }, [age, ageTouched]);

    const genderError = useMemo(() => {
        if (!genderTouched) return '';
        if (!gender) return 'Please select a gender.';
        return '';
    }, [gender, genderTouched]);

    const cityError = useMemo(() => {
        if (!cityTouched) return '';
        return city.trim() ? '' : 'Location is required.';
    }, [city, cityTouched]);

    const regionStateError = useMemo(() => {
        if (!regionStateTouched) return '';
        return regionState.trim() ? '' : 'State is required.';
    }, [regionState, regionStateTouched]);

    const villageError = useMemo(() => {
        if (!villageTouched) return '';
        return village.trim() ? '' : 'Village is required.';
    }, [village, villageTouched]);

    const onSave = useCallback(() => {
        setWeightTouched(true);
        setHeightTouched(true);
        setAgeTouched(true);
        setGenderTouched(true);
        setCityTouched(true);
        setRegionStateTouched(true);
        setVillageTouched(true);

        const hasError = [
            weightError,
            heightError,
            ageError,
            genderError,
            cityError,
            regionStateError,
            villageError,
        ].some((e) => !!e);
        if (hasError) return;
        Alert.alert('Saved', 'Your changes have been saved.');
    }, [
        weightError,
        heightError,
        ageError,
        genderError,
        cityError,
        regionStateError,
        villageError,
    ]);

    return (
        <ThemedView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <ThemedText type="subtitle">Your Profile</ThemedText>
                </View>
                <ThemedText type="default" style={styles.cardSubtext}>
                    Complete your profile to get personalized analysis.
                </ThemedText>
            </View>

            <View style={styles.sectionCard}>
                <ThemedText type="defaultSemiBold">Personal Details</ThemedText>
                <ThemedText type="default" style={styles.helperText}>
                    This information helps us tailor your experience.
                </ThemedText>

                <View style={styles.infoCard}>
                    <ThemedText type="defaultSemiBold">Registered Information</ThemedText>
                    <View style={styles.infoRow}>
                        <ThemedText>Full Name</ThemedText>
                        <ThemedText style={styles.infoValue}>{registeredInfo.fullName}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText>Email</ThemedText>
                        <ThemedText style={styles.infoValue}>{registeredInfo.email}</ThemedText>
                    </View>
                    <View style={styles.infoRow}>
                        <ThemedText>Phone</ThemedText>
                        <ThemedText style={styles.infoValue}>{registeredInfo.phone}</ThemedText>
                    </View>
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>Weight (kg)</ThemedText>
                    <TextInput
                        style={[styles.input, weightError ? styles.inputError : null]}
                        keyboardType="numeric"  
                        value={weight}
                        onChangeText={setWeight}
                        onBlur={() => setWeightTouched(true)}
                        placeholder="70"
                    />
                    {weightError ? <ThemedText style={styles.errorText}>{weightError}</ThemedText> : null}
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>Weight Photo</ThemedText>
                    <Pressable onPress={pickImage} style={styles.uploadButton}>
                        <ThemedText type="defaultSemiBold">Choose File</ThemedText>
                    </Pressable>
                    {photoUri ? (
                        <Image source={{ uri: photoUri }} style={styles.preview} contentFit="cover" />
                    ) : (
                        <ThemedText style={styles.helperText}>No file chosen</ThemedText>
                    )}
                    <ThemedText style={styles.helperText}>Upload a photo for verification.</ThemedText>
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>Height (cm)</ThemedText>
                    <TextInput
                        style={[styles.input, heightError ? styles.inputError : null]}
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                        onBlur={() => setHeightTouched(true)}
                        placeholder="175"
                    />
                    {heightError ? <ThemedText style={styles.errorText}>{heightError}</ThemedText> : null}
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>Age</ThemedText>
                    <TextInput
                        style={[styles.input, ageError ? styles.inputError : null]}
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                        onBlur={() => setAgeTouched(true)}
                        placeholder="28"
                    />
                    {ageError ? <ThemedText style={styles.errorText}>{ageError}</ThemedText> : null}
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>Gender</ThemedText>
                    <View style={styles.genderRow}>
                        {['Male', 'Female', 'Other'].map((g) => (
                            <Pressable
                                key={g}
                                style={[styles.genderPill, gender === g ? styles.genderPillActive : null]}
                                onPress={() => { setGender(g); setGenderTouched(true); }}
                            >
                                <ThemedText style={styles.genderPillText}>{g}</ThemedText>
                            </Pressable>
                        ))}
                    </View>
                    {!gender && genderError ? <ThemedText style={styles.errorText}>{genderError}</ThemedText> : null}
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>Location (City/Town)</ThemedText>
                    <TextInput
                        style={[styles.input, cityError ? styles.inputError : null]}
                        value={city}
                        onChangeText={setCity}
                        onBlur={() => setCityTouched(true)}
                        placeholder="Sunnyvale"
                    />
                    {cityError ? <ThemedText style={styles.errorText}>{cityError}</ThemedText> : null}
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>State</ThemedText>
                    <TextInput
                        style={[styles.input, regionStateError ? styles.inputError : null]}
                        value={regionState}
                        onChangeText={setRegionState}
                        onBlur={() => setRegionStateTouched(true)}
                        placeholder="California"
                    />
                    {regionStateError ? <ThemedText style={styles.errorText}>{regionStateError}</ThemedText> : null}
                </View>

                <View style={styles.fieldBlock}>
                    <ThemedText>Village</ThemedText>
                    <TextInput
                        style={[styles.input, villageError ? styles.inputError : null]}
                        value={village}
                        onChangeText={setVillage}
                        onBlur={() => setVillageTouched(true)}
                        placeholder="Cherry Orchard"
                    />
                    {villageError ? <ThemedText style={styles.errorText}>{villageError}</ThemedText> : null}
                </View>

                <Pressable onPress={onSave} style={styles.saveButton}>
                    <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>Save Changes</ThemedText>
                </Pressable>
            </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 16,
    },
    card: {
        gap: 6,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardSubtext: {
        opacity: 0.8,
    },
    sectionCard: {
        gap: 12,
    },
    helperText: {
        opacity: 0.7,
    },
    infoCard: {
        gap: 10,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'rgba(127,127,127,0.08)',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoValue: {
        opacity: 0.9,
    },
    fieldBlock: {
        gap: 6,
    },
    input: {
        height: 44,
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(127,127,127,0.35)',
        paddingHorizontal: 12,
        backgroundColor: 'rgba(127,127,127,0.08)',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
    },
    uploadButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(127,127,127,0.15)',
    },
    preview: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginTop: 8,
        backgroundColor: '#e5e7eb',
    },
    genderRow: {
        flexDirection: 'row',
        gap: 8,
    },
    genderPill: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: 'rgba(127,127,127,0.15)',
    },
    genderPillActive: {
        backgroundColor: 'rgba(59,130,246,0.25)',
    },
    genderPillText: {
        opacity: 0.95,
    },
    saveButton: {
        marginTop: 8,
        alignSelf: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#3B82F6',
    },
    saveButtonText: {
        color: '#fff',
    },
});


