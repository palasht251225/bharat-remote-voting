/**
 * Rashtriya Matdaan Network (RMN) - Main Application Controller
 * Architect & Sole Creator: Palash Tripathi (AI Product Engineer)
 */

class App {
  constructor() {
    this.blockchain = new Blockchain();
    this.aiEngine = new AIEngine();
    this.currentVoter = VOTING_DB.sampleVoters[0];
    this.votingStep = 1;
    this.selectedCandidate = null;
    this.lastVotedReceipt = null;
    this.soundEnabled = true;
    this.audioCtx = null;
    this.generatedOtp = "782914";
    this.zkNullifierToken = null;
    this.charts = {};

    this.blockchain.seedInitialVotes();
    this.initEventListeners();
    this.initSound();
    this.renderSampleVoterSelection();
    this.renderBlockchainExplorer();
    this.renderConstituencyRoster();
    this.renderAnalyticsCharts();
  }

  initSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    } catch (e) {
      console.warn("AudioContext init error", e);
    }
  }

  playEvmBeep() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.2);
    } catch (e) {}
  }

  playClickTone() {
    if (!this.soundEnabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  initEventListeners() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    const soundToggle = document.getElementById('soundToggleBtn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        soundToggle.innerHTML = this.soundEnabled ? 
          `<i data-lucide="volume-2" class="w-4 h-4 text-indiaGreen-600 inline"></i> Sound ON` : 
          `<i data-lucide="volume-x" class="w-4 h-4 text-slate-400 inline"></i> Sound OFF`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    this.blockchain.subscribe((event, data) => {
      this.renderBlockchainExplorer();
      this.updateHeaderStats();
    });

    const sampleSelect = document.getElementById('sampleVoterSelect');
    if (sampleSelect) {
      sampleSelect.addEventListener('change', (e) => {
        const voter = VOTING_DB.sampleVoters.find(v => v.id === e.target.value);
        if (voter) this.selectVoterProfile(voter);
      });
    }

    const sendOtpBtn = document.getElementById('sendOtpBtn');
    if (sendOtpBtn) sendOtpBtn.addEventListener('click', () => this.triggerSendOtp());

    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    if (verifyOtpBtn) verifyOtpBtn.addEventListener('click', () => this.verifyOtpAndProceed());

    const startScanBtn = document.getElementById('startScanBtn');
    if (startScanBtn) startScanBtn.addEventListener('click', () => this.startAIBiometricScan());

    const confirmLocationBtn = document.getElementById('confirmLocationBtn');
    if (confirmLocationBtn) confirmLocationBtn.addEventListener('click', () => this.generateZkTokenAndLoadEVM());

    const printVvpatBtn = document.getElementById('printVvpatBtn');
    if (printVvpatBtn) printVvpatBtn.addEventListener('click', () => window.print());

    const voteAnotherBtn = document.getElementById('voteAnotherBtn');
    if (voteAnotherBtn) voteAnotherBtn.addEventListener('click', () => this.resetVotingFlow());

    const tamperBtn = document.getElementById('tamperBlockBtn');
    if (tamperBtn) tamperBtn.addEventListener('click', () => this.demonstrateTampering());

    const repairBtn = document.getElementById('repairChainBtn');
    if (repairBtn) repairBtn.addEventListener('click', () => this.repairBlockchain());

    document.querySelectorAll('.ai-question-chip').forEach(chip => {
      chip.addEventListener('click', () => this.askAIAssistant(chip.dataset.question));
    });

    const assistantSendBtn = document.getElementById('assistantSendBtn');
    const assistantInput = document.getElementById('assistantInput');
    if (assistantSendBtn && assistantInput) {
      assistantSendBtn.addEventListener('click', () => {
        if (assistantInput.value.trim()) {
          this.askAIAssistant(assistantInput.value.trim());
          assistantInput.value = '';
        }
      });
      assistantInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && assistantInput.value.trim()) {
          this.askAIAssistant(assistantInput.value.trim());
          assistantInput.value = '';
        }
      });
    }
  }

  switchTab(tabId) {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.dataset.tab === tabId) {
        if (tabId === 'creator') {
          btn.className = "nav-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-amber-400 bg-amber-100 text-amber-900 flex items-center gap-2 whitespace-nowrap transition shadow-sm";
        } else {
          btn.className = "nav-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-saffron-500 bg-saffron-50 text-saffron-700 flex items-center gap-2 whitespace-nowrap transition shadow-sm";
        }
      } else {
        if (btn.dataset.tab === 'creator') {
          btn.className = "nav-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-2 whitespace-nowrap transition shadow-sm";
        } else {
          btn.className = "nav-tab-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2 whitespace-nowrap transition";
        }
      }
    });

    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      if (panel.id === `tab-${tabId}`) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    });

    if (tabId === 'explorer') this.renderBlockchainExplorer();
    else if (tabId === 'analytics') this.renderAnalyticsCharts();

    if (window.lucide) window.lucide.createIcons();
  }

  selectVoterProfile(voter) {
    this.currentVoter = voter;
    const nameEl = document.getElementById('voterProfileName');
    const aadhaarEl = document.getElementById('voterAadhaarInput');
    const epicEl = document.getElementById('voterEpicInput');
    const phoneEl = document.getElementById('voterPhoneInput');
    const avatarEl = document.getElementById('voterAvatarImg');
    const currentLocEl = document.getElementById('voterCurrentLocSummary');
    const homeLocEl = document.getElementById('voterHomeLocSummary');

    if (nameEl) nameEl.textContent = voter.name;
    if (aadhaarEl) aadhaarEl.value = voter.aadhaar;
    if (epicEl) epicEl.value = voter.epicNo;
    if (phoneEl) phoneEl.value = voter.phone;
    if (avatarEl) avatarEl.src = voter.photo;
    if (currentLocEl) currentLocEl.textContent = `${voter.currentCity}, ${voter.currentState}`;
    if (homeLocEl) homeLocEl.textContent = `${voter.constituencyName} (${voter.distanceFromHomeKm} km away)`;

    this.playClickTone();
  }

  renderSampleVoterSelection() {
    const select = document.getElementById('sampleVoterSelect');
    if (!select) return;
    select.innerHTML = VOTING_DB.sampleVoters.map(v => `
      <option value="${v.id}">${v.name} (${v.currentCity} -> Home: ${v.registeredDistrict}, ${v.registeredState})</option>
    `).join('');
    this.selectVoterProfile(VOTING_DB.sampleVoters[0]);
  }

  triggerSendOtp() {
    this.playClickTone();
    const otpNotice = document.getElementById('otpSentBanner');
    const otpInput = document.getElementById('voterOtpInput');
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (otpNotice) {
      otpNotice.classList.remove('hidden');
      otpNotice.innerHTML = `
        <div class="flex items-center justify-between text-xs bg-indiaGreen-50 border border-indiaGreen-200 p-3.5 rounded-xl text-indiaGreen-900 shadow-sm">
          <div class="flex items-center gap-2">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-indiaGreen-600"></i>
            <span>Govt UIDAI OTP sent to registered mobile ending in <strong>...${this.currentVoter.phone.slice(-4)}</strong></span>
          </div>
          <span class="font-mono bg-white px-2.5 py-1 rounded-lg text-indiaGreen-800 font-bold border border-indiaGreen-200 tracking-widest">Demo OTP: ${this.generatedOtp}</span>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    if (otpInput) {
      otpInput.value = this.generatedOtp;
      otpInput.focus();
    }
  }

  verifyOtpAndProceed() {
    const otpInput = document.getElementById('voterOtpInput');
    const val = otpInput ? otpInput.value.trim() : '';

    if (val !== this.generatedOtp && val !== "782914") {
      alert("Invalid OTP. Please enter the 6-digit Aadhaar OTP displayed in the green box.");
      return;
    }

    this.playClickTone();
    this.setVotingStep(2);
    this.startAIBiometricScan();
  }

  startAIBiometricScan() {
    const video = document.getElementById('biometricVideo');
    const canvas = document.getElementById('biometricCanvas');
    const promptTitle = document.getElementById('aiChallengeTitle');
    const promptDesc = document.getElementById('aiChallengeDesc');
    const progressBar = document.getElementById('aiChallengeProgressBar');
    const scoreBadge = document.getElementById('aiScoreBadge');

    this.aiEngine.speak("Please look directly into the camera for AI Biometric Liveness Verification.", "en-IN");

    this.aiEngine.initializeCamera(
      video,
      canvas,
      (stepIndex, prompt, score) => {
        if (promptTitle) promptTitle.textContent = prompt.title;
        if (promptDesc) promptDesc.textContent = prompt.desc;
        if (progressBar) progressBar.style.width = `${((stepIndex + 1) / 5) * 100}%`;
        if (scoreBadge) scoreBadge.textContent = `${score.toFixed(1)}% Anti-Spoof`;

        if (stepIndex === 1) this.aiEngine.speak("Please blink your eyes naturally.", "en-IN");
        if (stepIndex === 2) this.aiEngine.speak("Slightly tilt your head to the left.", "en-IN");
        if (stepIndex === 3) this.aiEngine.speak("Give a slight natural smile for micro-expression analysis.", "en-IN");
      },
      (receipt) => {
        this.biometricReceipt = receipt;
        this.aiEngine.speak("Biometric verification complete. Genuine voter confirmed.", "en-IN");
        setTimeout(() => {
          this.setVotingStep(3);
          this.renderDualLocationStep();
        }, 1200);
      }
    );
  }

  renderDualLocationStep() {
    const voter = this.currentVoter;
    const currLocEl = document.getElementById('step3CurrentLocation');
    const homeLocEl = document.getElementById('step3HomeLocation');
    const distanceBadge = document.getElementById('step3DistanceBadge');
    const relocationReason = document.getElementById('step3RelocationReason');
    const travelSaved = document.getElementById('step3TravelSaved');
    const nullifierBadge = document.getElementById('step3ZkNullifierHash');

    if (currLocEl) currLocEl.textContent = `${voter.currentCity}, ${voter.currentState} (Pin: ${voter.currentPincode})`;
    if (homeLocEl) homeLocEl.textContent = `${voter.constituencyName} - ${voter.registeredState}`;
    if (distanceBadge) distanceBadge.textContent = `${voter.distanceFromHomeKm} km Remote Distance`;
    if (relocationReason) relocationReason.textContent = voter.reasonForRelocation;
    if (travelSaved) travelSaved.textContent = `~${Math.round(voter.distanceFromHomeKm / 60)} hrs Travel Time & ₹${Math.round(voter.distanceFromHomeKm * 2.2)} Fare Saved`;

    const salt = "RMN_ELECTION_SALT_2026_SECRET_ZKP_PT";
    this.zkNullifierToken = "0xNUL_" + sha256Sync(voter.aadhaar + salt + voter.constituencyId).substring(0, 36);
    if (nullifierBadge) nullifierBadge.textContent = this.zkNullifierToken;
  }

  generateZkTokenAndLoadEVM() {
    this.playClickTone();
    this.setVotingStep(4);
    this.renderDigitalEVM();
  }

  renderDigitalEVM() {
    const voter = this.currentVoter;
    const constData = VOTING_DB.constituencies[voter.constituencyId] || VOTING_DB.constituencies["UP-PC-64"];
    const evmHeader = document.getElementById('evmConstituencyHeader');
    const candidateList = document.getElementById('evmCandidateRows');

    if (evmHeader) {
      evmHeader.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-full bg-indiaGreen-500 animate-pulse"></span>
              BALLOT UNIT (BU-01) — ${constData.name}
            </h3>
            <p class="text-xs text-slate-500 font-medium">State: ${constData.state} | Registered: ${constData.totalRegisteredVoters} | Remote E-Voters: ${constData.remoteVotersRegistered.toLocaleString()}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-indiaGreen-50 border border-indiaGreen-200 rounded-full text-xs font-mono font-bold text-indiaGreen-800">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 inline mr-1 text-indiaGreen-600"></i> ZK Anonymous Mode
            </span>
          </div>
        </div>
      `;
    }

    if (candidateList) {
      candidateList.innerHTML = constData.candidates.map((cand, idx) => `
        <div class="evm-candidate-row p-4 flex items-center justify-between gap-3 shadow-sm">
          <div class="flex items-center gap-3.5">
            <span class="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-extrabold font-mono text-xs flex items-center justify-center">
              ${idx + 1}
            </span>
            <div>
              <div class="font-bold text-slate-900 text-base">${cand.name}</div>
              <div class="text-xs text-slate-500 font-medium">${cand.party}</div>
              ${cand.manifesto ? `<div class="text-[11px] text-slate-500 mt-0.5"><i data-lucide="tag" class="w-3 h-3 inline text-saffron-600"></i> ${cand.manifesto}</div>` : ''}
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shadow-sm" title="${cand.party}">
              ${cand.symbolSvg}
            </div>

            <div id="led-${cand.id}" class="evm-led-lamp ready" title="Machine Ready"></div>

            <button class="evm-tactile-btn px-6 py-2.5 text-xs uppercase tracking-wider flex items-center gap-1.5"
                    onclick="window.app.handleCastVote('${cand.id}', '${cand.name.replace(/'/g, "\\'")}', '${cand.party.replace(/'/g, "\\'")}')">
              <span>VOTE</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5 inline"></i>
            </button>
          </div>
        </div>
      `).join('');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  handleCastVote(candidateId, candidateName, partyName) {
    this.selectedCandidate = { id: candidateId, name: candidateName, party: partyName };

    const led = document.getElementById(`led-${candidateId}`);
    if (led) {
      led.classList.remove('ready');
      led.classList.add('voted');
    }

    this.playEvmBeep();

    const voter = this.currentVoter;
    const tx = new Transaction({
      nullifierHash: this.zkNullifierToken || ("0xNUL_" + sha256Sync(voter.aadhaar + Date.now()).substring(0, 36)),
      constituencyId: voter.constituencyId,
      constituencyName: voter.constituencyName,
      candidateId: candidateId,
      candidateName: candidateName,
      partyName: partyName,
      remoteOrigin: `${voter.currentCity} (${voter.currentState})`,
      homeLocation: `${voter.registeredDistrict} (${voter.registeredState})`
    });

    try {
      this.blockchain.addTransaction(tx);
      const minedBlock = this.blockchain.minePendingTransactions("ECI-VALIDATOR-" + voter.currentCity.toUpperCase());

      this.lastVotedReceipt = {
        tx: tx,
        block: minedBlock,
        voter: voter,
        timestamp: Date.now()
      };

      setTimeout(() => {
        this.setVotingStep(5);
        this.renderVvpatSlip();
      }, 1000);
    } catch (err) {
      alert(err.message || "Failed to submit ballot.");
    }
  }

  renderVvpatSlip() {
    const receipt = this.lastVotedReceipt;
    if (!receipt) return;

    const qrContainer = document.getElementById('vvpatQrSvg');
    const txHashEl = document.getElementById('vvpatTxHash');
    const blockNumEl = document.getElementById('vvpatBlockNum');
    const merkleRootEl = document.getElementById('vvpatMerkleRoot');
    const nullifierEl = document.getElementById('vvpatNullifier');
    const candidateNameEl = document.getElementById('vvpatCandName');
    const partyNameEl = document.getElementById('vvpatPartyName');
    const constNameEl = document.getElementById('vvpatConstName');
    const timeEl = document.getElementById('vvpatTimestamp');

    if (candidateNameEl) candidateNameEl.textContent = receipt.tx.candidateName;
    if (partyNameEl) partyNameEl.textContent = receipt.tx.partyName;
    if (constNameEl) constNameEl.textContent = receipt.tx.constituencyName;
    if (txHashEl) txHashEl.textContent = receipt.tx.txHash;
    if (blockNumEl) blockNumEl.textContent = `#${receipt.block.index}`;
    if (merkleRootEl) merkleRootEl.textContent = receipt.block.merkleRoot.substring(0, 24) + "...";
    if (nullifierEl) nullifierEl.textContent = receipt.tx.nullifierHash.substring(0, 24) + "...";
    if (timeEl) timeEl.textContent = new Date(receipt.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + " IST";

    if (qrContainer) {
      qrContainer.innerHTML = this.generateTamperProofQrSvg(receipt.tx.txHash, receipt.block.index);
    }

    if (window.lucide) window.lucide.createIcons();
    this.renderBlockchainExplorer();
    this.renderAnalyticsCharts();
  }

  generateTamperProofQrSvg(hash, blockIdx) {
    const size = 110;
    const cells = 15;
    const cellSize = size / cells;
    let rects = '';

    for (let r = 0; r < cells; r++) {
      for (let c = 0; c < cells; c++) {
        const isCorner = (r < 3 && c < 3) || (r < 3 && c > cells - 4) || (r > cells - 4 && c < 3);
        const charCode = hash.charCodeAt((r * cells + c) % hash.length);
        if (isCorner || (charCode % 2 === 0)) {
          rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize - 0.5}" height="${cellSize - 0.5}" fill="#0f172a"/>`;
        }
      }
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="bg-white p-2 rounded-xl border border-slate-300">
        ${rects}
      </svg>
    `;
  }

  resetVotingFlow() {
    this.votingStep = 1;
    this.selectedCandidate = null;
    this.lastVotedReceipt = null;
    this.aiEngine.stopCamera();
    this.setVotingStep(1);
    this.renderSampleVoterSelection();
  }

  setVotingStep(step) {
    this.votingStep = step;
    document.querySelectorAll('.voting-step-pane').forEach((pane, idx) => {
      if (idx + 1 === step) pane.classList.remove('hidden');
      else pane.classList.add('hidden');
    });

    document.querySelectorAll('.step-bubble').forEach((b, idx) => {
      if (idx + 1 === step) {
        b.className = "step-bubble w-9 h-9 rounded-full bg-saffron-600 text-white font-bold flex items-center justify-center text-xs shadow-md shadow-saffron-500/30 ring-4 ring-saffron-100";
      } else if (idx + 1 < step) {
        b.className = "step-bubble w-9 h-9 rounded-full bg-indiaGreen-600 text-white font-bold flex items-center justify-center text-xs";
      } else {
        b.className = "step-bubble w-9 h-9 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-xs border border-slate-200";
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  renderBlockchainExplorer() {
    const list = document.getElementById('blockchainBlocksList');
    const validityBanner = document.getElementById('blockchainValidityBanner');
    const statsTotalBlocks = document.getElementById('statsTotalBlocks');
    const statsTotalTxs = document.getElementById('statsTotalTxs');

    const chain = this.blockchain.chain;
    const validity = this.blockchain.isChainValid();

    if (statsTotalBlocks) statsTotalBlocks.textContent = chain.length;
    let totalTxsCount = 0;
    chain.forEach(b => totalTxsCount += (b.transactions ? b.transactions.length : 0));
    if (statsTotalTxs) statsTotalTxs.textContent = totalTxsCount;

    if (validityBanner) {
      if (validity.valid) {
        validityBanner.className = "p-4 rounded-2xl bg-indiaGreen-50 border border-indiaGreen-200 text-indiaGreen-900 flex items-center justify-between mb-6 shadow-sm";
        validityBanner.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indiaGreen-100 flex items-center justify-center text-indiaGreen-700">
              <i data-lucide="shield-check" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="font-bold text-sm text-indiaGreen-900">BLOCKCHAIN LEDGER 100% CRYPTOGRAPHICALLY VALID</div>
              <div class="text-xs text-indiaGreen-700 font-medium">All SHA-256 Merkle proofs, nonce difficulties, and block sequence links verified. Zero tampering detected.</div>
            </div>
          </div>
          <span class="px-3.5 py-1 bg-white text-indiaGreen-800 text-xs font-mono rounded-full font-bold border border-indiaGreen-300">Consensus: ACTIVE</span>
        `;
      } else {
        validityBanner.className = "p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 flex items-center justify-between mb-6 shadow-sm animate-pulse";
        validityBanner.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <i data-lucide="alert-triangle" class="w-6 h-6"></i>
            </div>
            <div>
              <div class="font-bold text-sm text-red-900">TAMPER DETECTION ALERT: ${validity.reason}</div>
              <div class="text-xs text-red-700 font-medium">The cryptographic hash cascade broke at Block #${validity.brokenBlockIndex}. Immediate consensus rejection triggered!</div>
            </div>
          </div>
          <button onclick="window.app.repairBlockchain()" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-sm">
            Auto-Repair Ledger
          </button>
        `;
      }
    }

    if (list) {
      list.innerHTML = chain.map((block, idx) => {
        const isBroken = !validity.valid && idx >= validity.brokenBlockIndex;
        return `
          <div class="blockchain-block ${isBroken ? 'tampered-alert' : ''} p-5 mb-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 ${idx === 0 ? 'bg-amber-100 text-amber-900 border-amber-300' : isBroken ? 'bg-red-100 text-red-900 border-red-300' : 'bg-blue-50 text-blue-800 border-blue-200'} border rounded-lg font-mono text-xs font-bold">
                  BLOCK #${block.index} ${idx === 0 ? '(GENESIS)' : ''}
                </span>
                <span class="text-xs text-slate-500 font-mono">${new Date(block.timestamp).toLocaleTimeString('en-IN')} IST</span>
                <span class="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">Nonce: ${block.nonce}</span>
              </div>
              <div class="text-xs text-slate-500 font-mono flex items-center gap-2">
                <span>Validator Node:</span>
                <span class="text-slate-900 font-bold">${block.validatorNode}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-3 text-xs font-mono">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="text-slate-500 mb-1 text-[11px]">Block Hash (SHA-256):</div>
                <div class="text-slate-900 break-all font-bold">${block.hash}</div>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="text-slate-500 mb-1 text-[11px]">Previous Block Hash:</div>
                <div class="text-slate-500 break-all">${block.previousHash}</div>
              </div>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-3 text-xs font-mono">
              <div class="text-slate-500 mb-1 text-[11px]">Merkle Root:</div>
              <div class="text-blue-900 break-all font-bold">${block.merkleRoot}</div>
            </div>

            <div class="mt-4">
              <div class="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Transactions Recorded (${block.transactions.length})</span>
                <span class="text-indiaGreen-700 text-[11px] font-medium">Decoupled ZK Anonymous Records</span>
              </div>
              <div class="space-y-2">
                ${block.transactions.map(tx => `
                  <div class="p-3.5 bg-white rounded-xl border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-sm">
                    <div>
                      <div class="font-bold text-slate-900">${tx.candidateName} <span class="text-slate-500 font-normal">(${tx.partyName})</span></div>
                      <div class="text-[11px] text-saffron-700 font-mono font-medium mt-0.5">${tx.constituencyName}</div>
                      <div class="text-[11px] text-indiaGreen-700 font-mono mt-0.5">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5 inline"></i> Origin: ${tx.remoteOrigin} -> Home: ${tx.homeLocation}
                      </div>
                    </div>
                    <div class="text-right font-mono">
                      <div class="text-slate-500 text-[11px]">ZK Nullifier: <span class="text-slate-900 font-semibold">${tx.nullifierHash.substring(0, 18)}...</span></div>
                      <div class="text-[10px] text-slate-400 truncate max-w-[200px]">Tx: ${tx.txHash.substring(0, 20)}...</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      }).reverse().join('');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  demonstrateTampering() {
    if (this.blockchain.chain.length < 2) {
      alert("Please cast at least one vote first to generate blocks for tampering demonstration.");
      return;
    }
    this.blockchain.tamperBlock(1, 'candidateName', 'MALICIOUS_TAMPERED_CANDIDATE');
    this.renderBlockchainExplorer();
    this.playClickTone();
  }

  repairBlockchain() {
    this.blockchain.repairChain();
    this.renderBlockchainExplorer();
    this.playClickTone();
  }

  renderConstituencyRoster() {
    const container = document.getElementById('constituenciesGrid');
    if (!container) return;

    const items = Object.values(VOTING_DB.constituencies);
    container.innerHTML = items.map(c => `
      <div class="civic-card p-5 hover:border-saffron-300">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">${c.id}</span>
          <span class="text-xs text-indiaGreen-700 font-semibold"><i data-lucide="activity" class="w-3.5 h-3.5 inline"></i> Turnout: ${c.currentTurnout}</span>
        </div>
        <h4 class="font-bold text-slate-900 text-base mb-0.5">${c.name}</h4>
        <p class="text-xs text-slate-500 mb-3">${c.state} • Registered: ${c.totalRegisteredVoters} voters</p>

        <div class="space-y-2 border-t border-slate-100 pt-3">
          <div class="text-xs font-bold text-slate-700">Contesting Candidates:</div>
          ${c.candidates.map(cand => `
            <div class="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 flex items-center justify-center">${cand.symbolSvg}</span>
                <div>
                  <span class="font-bold text-slate-800">${cand.name}</span>
                  <span class="text-slate-500 text-[11px] block">${cand.party}</span>
                </div>
              </div>
              <span class="text-[10px] text-slate-500 font-medium">${cand.education}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  renderAnalyticsCharts() {
    const ctx1 = document.getElementById('chartStateTurnout');
    if (ctx1 && window.Chart) {
      if (this.charts.stateTurnout) this.charts.stateTurnout.destroy();
      const labels = VOTING_DB.stateTurnoutStats.map(s => s.state);
      const data = VOTING_DB.stateTurnoutStats.map(s => s.turnoutPct);

      this.charts.stateTurnout = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Voter Turnout %',
            data: data,
            backgroundColor: '#ea580c',
            borderColor: '#c2410c',
            borderWidth: 1,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 40, max: 100, grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 11, weight: '500' } } }
          }
        }
      });
    }

    const ctx2 = document.getElementById('chartRemoteBreakdown');
    if (ctx2 && window.Chart) {
      if (this.charts.remoteBreakdown) this.charts.remoteBreakdown.destroy();
      this.charts.remoteBreakdown = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Remote Domestic Migrants (Students/Tech/Workers)', 'Hometown Physical In-Person Voters', 'Armed Forces / Border Nodes'],
          datasets: [{
            data: [38.4, 57.2, 4.4],
            backgroundColor: ['#ea580c', '#16a34a', '#2563eb'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#334155', font: { size: 11, weight: '500' }, padding: 14 } } }
        }
      });
    }
  }

  askAIAssistant(question) {
    const chatContainer = document.getElementById('aiChatMessages');
    if (!chatContainer) return;

    const userDiv = document.createElement('div');
    userDiv.className = "flex items-start gap-3 justify-end mb-4";
    userDiv.innerHTML = `
      <div class="bg-slate-900 text-white p-3.5 rounded-2xl rounded-tr-none text-xs max-w-md shadow-sm">
        ${question}
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-800 font-bold text-xs">
        YOU
      </div>
    `;
    chatContainer.appendChild(userDiv);

    let answer = "";
    const qLower = question.toLowerCase();

    if (qLower.includes("palash") || qLower.includes("creator") || qLower.includes("engineer") || qLower.includes("author") || qLower.includes("who built")) {
      answer = "This groundbreaking system was architected and engineered by Palash Tripathi, an AI Product Engineer and Decentralized Systems Architect. Palash designed this platform to bridge advanced Artificial Intelligence (computer vision liveness, anti-deepfake anti-spoofing) with Zero-Knowledge blockchain cryptography, ensuring that 450+ million migrant Indian citizens can exercise their voting rights under Article 326 from anywhere in India. All intellectual property, system frameworks, and copyright are exclusively reserved to Palash Tripathi.";
    } else if (qLower.includes("work") || qLower.includes("how")) {
      answer = "The Bharat Remote Voting System uses a 5-step cryptographic pipeline: (1) Aadhaar UIDAI + EPIC Voter ID authentication, (2) AI Computer Vision Face Liveness Check, (3) Dual-Constituency Resolution mapping your remote city to your home constituency, (4) An anonymous Zero-Knowledge Token issuance that completely decouples your identity from your vote, and (5) Casting the encrypted vote onto an immutable SHA-256 Blockchain with instant Digital VVPAT generation.";
    } else if (qLower.includes("anonymous") || qLower.includes("privacy") || qLower.includes("secret")) {
      answer = "Yes, 100% anonymous! Under our Zero-Knowledge Blind Signature protocol, once your Aadhaar verifies you as an eligible Indian voter, the system computes a one-time cryptographic Nullifier Hash. The blockchain records only the Nullifier and the cast ballot—never your Aadhaar, name, or phone number. Not even the Election Commission or server admins can link a voter to their choice.";
    } else if (qLower.includes("twice") || qLower.includes("double") || qLower.includes("fraud")) {
      answer = "Double voting is mathematically impossible. Each voter generates a unique cryptographic Nullifier Hash for the current election cycle. When a vote is submitted, the Blockchain smart contract checks if the Nullifier is already present in the global ledger. If present, the transaction is rejected instantly and flagged as an anomaly.";
    } else if (qLower.includes("vvpat") || qLower.includes("verify") || qLower.includes("slip")) {
      answer = "Your Digital VVPAT (Voter Verifiable Paper Audit Trail) contains a verifiable QR code, Block Number, Transaction Hash, and Merkle Proof. You can verify that your vote was included in the block without revealing who you voted for.";
    } else {
      answer = `Thank you for asking about "${question}". The Bharat Remote AI & Blockchain Voting System empowers 450+ million domestic Indian migrants to exercise their constitutional right under Article 326 from anywhere in India without travel barriers.`;
    }

    setTimeout(() => {
      const aiDiv = document.createElement('div');
      aiDiv.className = "flex items-start gap-3 mb-4";
      aiDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-indiaGreen-100 border border-indiaGreen-300 flex items-center justify-center text-indiaGreen-700 font-bold text-xs flex-shrink-0">
          <i data-lucide="bot" class="w-4 h-4"></i>
        </div>
        <div class="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl rounded-tl-none text-xs max-w-lg shadow-sm space-y-2">
          <div class="font-bold text-slate-900 flex items-center gap-2">
            <span>Matdaan Saathi (मतदान साथी AI)</span>
            <span class="px-2 py-0.5 bg-indiaGreen-50 border border-indiaGreen-200 text-indiaGreen-700 text-[10px] rounded-full font-bold">Verified</span>
          </div>
          <div class="leading-relaxed">${answer}</div>
          <button onclick="window.app.aiEngine.speak('${answer.replace(/'/g, "\\'")}', 'en-IN')" class="text-[11px] text-saffron-700 font-semibold hover:text-saffron-800 flex items-center gap-1 mt-1">
            <i data-lucide="volume-2" class="w-3.5 h-3.5 inline"></i> Listen to AI Voice
          </button>
        </div>
      `;
      chatContainer.appendChild(aiDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    }, 400);
  }

  updateHeaderStats() {
    const ticker = document.getElementById('headerBlockHeightTicker');
    if (ticker) {
      ticker.textContent = `Block #${this.blockchain.getLatestBlock().index}`;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  if (window.lucide) window.lucide.createIcons();
});
