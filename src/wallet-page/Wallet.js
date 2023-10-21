import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import styles from "./Wallet.style";
import { useIsFocused } from "@react-navigation/native";

const Wallet = () => {
    const [topUpAmount, setTopUpAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [walletActivity, setWalletActivity] = useState([]);
    const isFocused = useIsFocused();
    
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;
    const firestore = getFirestore();
    const walletActivityRef = collection(firestore, "wallet-activity");

    const fetchWalletActivity = async () => {
        try {
        const q = query(walletActivityRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const walletActivityData = querySnapshot.docs.map((doc) => doc.data());
        setWalletActivity(walletActivityData);
        } catch (error) {
        console.error("Error fetching wallet activity:", error);
        }
    };

    const fetchTransactions = async () => {
        try {
          const userRef = doc(firestore, 'users', userId);
          const transactionsRef = collection(userRef, 'transactions');
          const querySnapshot = await getDocs(transactionsRef);
          const transactionData = querySnapshot.docs.map(doc => doc.data());
          setTransactions(transactionData);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
    const fetchUserBalance = async (userId) => {
      try {
        const userDocRef = doc(firestore, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const userBalance = userData.balance;

          if (userBalance === undefined) {
            await setDoc(userDocRef, { balance: 0 }, { merge: true });
            setBalance(0);
          } else {
            setBalance(userBalance);
          }
        } else {
          await setDoc(userDocRef, { balance: 0 }, { merge: true });
          setBalance(0);
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
      }
    };

        fetchUserBalance(userId);
        fetchWalletActivity();
        fetchTransactions(); 
    }, [userId]);

    const handleTopUp = async () => {
        try {
        // Show a confirmation dialog
        Alert.alert(
            "Confirm Top Up",
            `Are you sure you want to top up $${topUpAmount}?`,
            [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "OK",
                onPress: async () => {
                const newBalance = balance + parseFloat(topUpAmount);
                await setDoc(
                    doc(firestore, "users", userId),
                    { balance: newBalance },
                    { merge: true }
                );
                await addDoc(walletActivityRef, {
                    type: "top_up",
                    amount: parseFloat(topUpAmount),
                    timestamp: new Date(),
                    userId: userId,
                });
                setBalance(newBalance);
                setTopUpAmount("");
                fetchWalletActivity(); // Fetch transactions after top-up
                },
            },
            ]
        );
        } catch (error) {
        console.error("Error topping up:", error);
        }
    };

    if (isFocused) {
        fetchTransactions(); 
    }

    const handleWithdraw = async () => {
        try {
        // Show a confirmation dialog
        Alert.alert(
            "Confirm Withdraw",
            `Are you sure you want to withdraw $${withdrawAmount}?`,
            [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "OK",
                onPress: async () => {
                const newBalance = balance - parseFloat(withdrawAmount);
                if (newBalance < 0) {
                    alert("Insufficient balance for withdrawal.");
                    return;
                }
                await setDoc(
                    doc(firestore, "users", userId),
                    { balance: newBalance },
                    { merge: true }
                );
                await addDoc(walletActivityRef, {
                    type: "withdrawal",
                    amount: parseFloat(withdrawAmount),
                    timestamp: new Date(),
                    userId: userId,
                });
                setBalance(newBalance);
                setWithdrawAmount("");
                fetchWalletActivity(); // Fetch transactions after withdrawal
                },
            },
            ]
        );
        } catch (error) {
        console.error("Error withdrawing:", error);
        }
    };

    return (
        <View style={styles.container}>
        <Text>Balance: ${balance.toFixed(2)}</Text>
        <TextInput
            style={styles.input}
            placeholder="Top Up Amount"
            value={topUpAmount}
            onChangeText={(text) => setTopUpAmount(text)}
            keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleTopUp}>
            <Text style={styles.buttonText}>Top Up</Text>
        </TouchableOpacity>
        <TextInput
            style={styles.input}
            placeholder="Withdraw Amount"
            value={withdrawAmount}
            onChangeText={(text) => setWithdrawAmount(text)}
            keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
            <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>
        <Text>Transactions:</Text>
        <FlatList
        data={[...walletActivity, ...transactions]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
        if (item.hasOwnProperty('amount')) {
            return (
            <View style={styles.transactionItem}>
                <Text>Type: {item.type}</Text>
                <Text>Amount: ${item.amount.toFixed(2)}</Text>
            </View>
            );
        } else {
            return (
            <View style={styles.transactionCard}>
                <View style={styles.transactionDetails}>
                <Text style={styles.transactionType}>{item.type}</Text>
                <Text>Symbol: {item.symbol}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Price: ${item.price}</Text>
                <Text>Total Price: ${item.totalPrice}</Text>
                <Text>Timestamp: {item.timestamp.toDate().toLocaleString()}</Text>
                </View>
            </View>
            );
        }
        }}
    />
        </View>
    );
    };

export default Wallet;