/**
 * Rashtriya Matdaan Network (RMN) - Cryptographic Blockchain Ledger Engine
 * Implements Immutable Distributed Ledger, SHA-256 Merkle Trees, ZK-Nullifier verification,
 * and Smart-Contract Tallying.
 */

// Synchronous SHA-256 implementation for fast client-side blockchain calculations
function sha256Sync(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';

  var words = [];
  var asciiBitLength = ascii[lengthProperty] * 8;
  
  var hash = [];
  var k = [];
  var primeCounter = 0;

  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength | 0);
  
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash;
    hash = hash.slice(0, 8);
    
    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    for (i2 = 3; i2 >= 0; i2--) {
      var c = (hash[i] >> (i2 * 8)) & 255;
      result += ((c < 16) ? '0' : '') + c.toString(16);
    }
  }
  return result;
}

class Transaction {
  constructor({
    nullifierHash,
    constituencyId,
    constituencyName,
    candidateId,
    candidateName,
    partyName,
    remoteOrigin,
    homeLocation,
    timestamp = Date.now(),
    signature = null,
    isGenesis = false
  }) {
    this.nullifierHash = nullifierHash; // ZKP anonymous identity token
    this.constituencyId = constituencyId;
    this.constituencyName = constituencyName;
    this.candidateId = candidateId;
    this.candidateName = candidateName;
    this.partyName = partyName;
    this.remoteOrigin = remoteOrigin;
    this.homeLocation = homeLocation;
    this.timestamp = timestamp;
    this.signature = signature || this.generateProofSignature();
    this.isGenesis = isGenesis;
    this.txHash = this.calculateHash();
  }

  calculateHash() {
    const raw = `${this.nullifierHash}_${this.constituencyId}_${this.candidateId}_${this.timestamp}_${this.signature}`;
    return sha256Sync(raw);
  }

  generateProofSignature() {
    // Zero-knowledge blinded signature simulation with elliptic curve standard
    const entropy = Math.random().toString(36).substring(2) + Date.now().toString(36);
    return "0xZK_SIG_" + sha256Sync(entropy + this.nullifierHash).substring(0, 48);
  }
}

class Block {
  constructor(index, timestamp, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.merkleRoot = this.calculateMerkleRoot();
    this.validatorNode = "ECI-GEN-NODE-" + (index % 5 + 1).toString().padStart(2, '0');
    this.hash = this.calculateHash();
  }

  calculateMerkleRoot() {
    if (!this.transactions || this.transactions.length === 0) {
      return sha256Sync("EMPTY_BLOCK_TRANSACTIONS");
    }
    let hashes = this.transactions.map(tx => tx.txHash || sha256Sync(JSON.stringify(tx)));
    while (hashes.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = (i + 1 < hashes.length) ? hashes[i + 1] : left;
        nextLevel.push(sha256Sync(left + right));
      }
      hashes = nextLevel;
    }
    return hashes[0];
  }

  calculateHash() {
    const raw = `${this.index}${this.previousHash}${this.timestamp}${this.merkleRoot}${this.nonce}${this.validatorNode}`;
    return sha256Sync(raw);
  }

  mineBlock(difficulty = 2) {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    return this.hash;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.nullifiersRegistry = new Set(); // Prevents double voting across all blocks
    this.listeners = [];
  }

  createGenesisBlock() {
    const genesisTx = new Transaction({
      nullifierHash: "0xGENESIS_INIT_ASHOKA_CHAKRA_2026_GOI",
      constituencyId: "INDIA-NATIONAL-INIT",
      constituencyName: "Bharat Rashtriya Matdaan Network Protocol v2.4",
      candidateId: "CONSTITUTION_OF_INDIA",
      candidateName: "Democracy & Universal Adult Suffrage (Art. 326)",
      partyName: "Election Commission of India",
      remoteOrigin: "National Capital Territory, New Delhi",
      homeLocation: "Pan-India Sovereignty",
      timestamp: 1725062400000,
      isGenesis: true
    });
    
    const genesis = new Block(0, 1725062400000, [genesisTx], "0".repeat(64));
    genesis.mineBlock(1);
    return genesis;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    if (!transaction.nullifierHash || !transaction.candidateId || !transaction.constituencyId) {
      throw new Error("Invalid transaction payload: missing critical voting fields");
    }

    // Double voting check
    if (this.nullifiersRegistry.has(transaction.nullifierHash)) {
      throw new Error("FRAUD ATTEMPT DETECTED: This citizen's cryptographic nullifier has already cast a vote in this election cycle.");
    }

    this.pendingTransactions.push(transaction);
    this.notifyListeners('transaction_added', transaction);
    return transaction;
  }

  minePendingTransactions(validatorAddress = "ECI-CENTRAL-VALIDATOR-01") {
    if (this.pendingTransactions.length === 0) {
      return null;
    }

    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      [...this.pendingTransactions],
      previousBlock.hash
    );

    newBlock.validatorNode = validatorAddress;
    newBlock.mineBlock(this.difficulty);

    // Register all nullifiers to prevent duplicate voting
    for (const tx of this.pendingTransactions) {
      this.nullifiersRegistry.add(tx.nullifierHash);
    }

    this.chain.push(newBlock);
    const minedBlock = newBlock;
    this.pendingTransactions = [];

    this.notifyListeners('block_mined', minedBlock);
    return minedBlock;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify previous hash link
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          valid: false,
          brokenBlockIndex: i,
          reason: `Broken chain link at Block #${i}: PreviousHash mismatch with Block #${i-1}.`
        };
      }

      // Verify Merkle Root
      const recomputedMerkle = currentBlock.calculateMerkleRoot();
      if (currentBlock.merkleRoot !== recomputedMerkle) {
        return {
          valid: false,
          brokenBlockIndex: i,
          reason: `Merkle Root corruption at Block #${i}: Transactions have been altered.`
        };
      }

      // Verify Block Hash
      const recomputedHash = currentBlock.calculateHash();
      if (currentBlock.hash !== recomputedHash) {
        return {
          valid: false,
          brokenBlockIndex: i,
          reason: `Tampered Hash at Block #${i}: Recomputed (${recomputedHash.substring(0, 16)}...) != Stored (${currentBlock.hash.substring(0, 16)}...).`
        };
      }
    }
    return { valid: true };
  }

  tamperBlock(index, field = 'candidateName', newValue = 'TAMPERED_MALICIOUS_CANDIDATE') {
    if (index <= 0 || index >= this.chain.length) {
      throw new Error("Invalid block index for tampering demonstration");
    }
    const block = this.chain[index];
    if (block.transactions && block.transactions.length > 0) {
      block.transactions[0][field] = newValue;
      // Note: We deliberately do NOT re-mine or recalculate hash to demonstrate instant cryptographic detection!
    }
    this.notifyListeners('chain_tampered', { index, field, newValue });
    return this.isChainValid();
  }

  repairChain() {
    this.nullifiersRegistry.clear();
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      if (i > 0) {
        block.previousHash = this.chain[i - 1].hash;
      }
      block.merkleRoot = block.calculateMerkleRoot();
      block.mineBlock(this.difficulty);

      // Re-populate nullifiers
      if (block.transactions) {
        for (const tx of block.transactions) {
          if (!tx.isGenesis) {
            this.nullifiersRegistry.add(tx.nullifierHash);
          }
        }
      }
    }
    this.notifyListeners('chain_repaired', this.chain);
    return this.isChainValid();
  }

  getVotesByConstituency(constituencyId) {
    const tally = {};
    let totalVotes = 0;
    let remoteVotes = 0;

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.isGenesis) continue;
        if (!constituencyId || tx.constituencyId === constituencyId) {
          totalVotes++;
          if (tx.remoteOrigin && tx.remoteOrigin !== tx.homeLocation) {
            remoteVotes++;
          }
          if (!tally[tx.candidateId]) {
            tally[tx.candidateId] = {
              candidateId: tx.candidateId,
              candidateName: tx.candidateName,
              partyName: tx.partyName,
              votes: 0,
              constituencyId: tx.constituencyId
            };
          }
          tally[tx.candidateId].votes++;
        }
      }
    }

    return {
      constituencyId,
      totalVotes,
      remoteVotes,
      localVotes: totalVotes - remoteVotes,
      tally: Object.values(tally).sort((a, b) => b.votes - a.votes)
    };
  }

  getAllConstituencyTallies() {
    const allTallies = {};
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.isGenesis) continue;
        if (!allTallies[tx.constituencyId]) {
          allTallies[tx.constituencyId] = {
            constituencyId: tx.constituencyId,
            constituencyName: tx.constituencyName,
            totalVotes: 0,
            remoteVotes: 0,
            candidates: {}
          };
        }
        allTallies[tx.constituencyId].totalVotes++;
        if (tx.remoteOrigin && tx.remoteOrigin !== tx.homeLocation) {
          allTallies[tx.constituencyId].remoteVotes++;
        }
        if (!allTallies[tx.constituencyId].candidates[tx.candidateId]) {
          allTallies[tx.constituencyId].candidates[tx.candidateId] = {
            candidateName: tx.candidateName,
            partyName: tx.partyName,
            votes: 0
          };
        }
        allTallies[tx.constituencyId].candidates[tx.candidateId].votes++;
      }
    }
    return allTallies;
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners(event, data) {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (err) {
        console.error("Blockchain event listener error:", err);
      }
    }
  }

  // Pre-seeds sample historical votes for realistic visualization
  seedInitialVotes() {
    const sampleSeedVotes = [
      {
        nullifierHash: "0xZK_SEED_NUL_78129034",
        constituencyId: "UP-PC-64",
        constituencyName: "Varanasi (UP PC-64)",
        candidateId: "CAND-UP-01",
        candidateName: "Narendra Modi",
        partyName: "Bharatiya Janata Party (BJP)",
        remoteOrigin: "Hyderabad (Telangana)",
        homeLocation: "Varanasi (Uttar Pradesh)"
      },
      {
        nullifierHash: "0xZK_SEED_NUL_19283746",
        constituencyId: "UP-PC-64",
        constituencyName: "Varanasi (UP PC-64)",
        candidateId: "CAND-UP-02",
        candidateName: "Ajay Rai",
        partyName: "Indian National Congress (INC)",
        remoteOrigin: "Chennai (Tamil Nadu)",
        homeLocation: "Varanasi (Uttar Pradesh)"
      },
      {
        nullifierHash: "0xZK_SEED_NUL_45678912",
        constituencyId: "KL-PC-04",
        constituencyName: "Wayanad (KL PC-04)",
        candidateId: "CAND-KL-01",
        candidateName: "Rahul Gandhi",
        partyName: "Indian National Congress (INC)",
        remoteOrigin: "Bengaluru (Karnataka)",
        homeLocation: "Wayanad (Kerala)"
      },
      {
        nullifierHash: "0xZK_SEED_NUL_67891234",
        constituencyId: "KA-PC-26",
        constituencyName: "Bangalore South (KA PC-26)",
        candidateId: "CAND-KA-01",
        candidateName: "Tejasvi Surya",
        partyName: "Bharatiya Janata Party (BJP)",
        remoteOrigin: "Gurugram (Haryana)",
        homeLocation: "Bangalore (Karnataka)"
      },
      {
        nullifierHash: "0xZK_SEED_NUL_98761234",
        constituencyId: "WB-PC-23",
        constituencyName: "Kolkata Dakshin (WB PC-23)",
        candidateId: "CAND-WB-01",
        candidateName: "Mala Roy",
        partyName: "All India Trinamool Congress (AITC)",
        remoteOrigin: "Pune (Maharashtra)",
        homeLocation: "Kolkata (West Bengal)"
      }
    ];

    for (const v of sampleSeedVotes) {
      const tx = new Transaction(v);
      this.addTransaction(tx);
    }
    this.minePendingTransactions("ECI-NODE-PRIMARY-DELHI");
  }
}

// Attach to window or module
if (typeof window !== 'undefined') {
  window.Blockchain = Blockchain;
  window.Block = Block;
  window.Transaction = Transaction;
  window.sha256Sync = sha256Sync;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Blockchain, Block, Transaction, sha256Sync };
}
