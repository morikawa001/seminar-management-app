(function(){
  var firebaseConfig = {
    apiKey: "AIzaSyDkII6eW8Yz0noTFLw7iGqywhxX_xubpp8",
    authDomain: "seminar-management-app-data.firebaseapp.com",
    projectId: "seminar-management-app-data",
    storageBucket: "seminar-management-app-data.firebasestorage.app",
    messagingSenderId: "428635837329",
    appId: "1:428635837329:web:dba5dff12d906943ce4030",
    measurementId: "G-HRPCFGFVHL"
  };

  firebase.initializeApp(firebaseConfig);
  var auth = firebase.auth();
  var db = firebase.firestore();

  var DB_COLLECTION = 'seminars';
  var currentUser = null;

  auth.onAuthStateChanged(function(user){
    currentUser = user;
    var loginSection = document.getElementById('loginSection');
    var appContainer = document.getElementById('appContainer');
    if(user){
      if(loginSection) loginSection.style.display = 'none';
      if(appContainer) appContainer.style.display = '';
      if(typeof onFirebaseLogin === 'function') onFirebaseLogin(user);
    } else {
      if(loginSection) loginSection.style.display = '';
      if(appContainer) appContainer.style.display = 'none';
    }
  });

  function getEmail(){ return (document.getElementById('loginEmail')||{}).value || ''; }
  function getPassword(){ return (document.getElementById('loginPassword')||{}).value || ''; }
  function showMsg(msg, isError){
    var el = document.getElementById('loginMessage');
    if(!el) return;
    el.textContent = msg;
    el.style.color = isError ? 'var(--danger)' : 'var(--green)';
    el.style.display = '';
  }

  window.login = function(){
    var email = getEmail(), password = getPassword();
    if(!email || !password){ showMsg('メールアドレスとパスワードを入力してください', true); return; }
    auth.signInWithEmailAndPassword(email, password)
      .then(function(){ showMsg('ログインしました', false); })
      .catch(function(err){ showMsg('ログインエラー: ' + err.message, true); });
  };

  window.register = function(){
    var email = getEmail(), password = getPassword();
    if(!email || !password){ showMsg('メールアドレスとパスワードを入力してください', true); return; }
    if(password.length < 6){ showMsg('パスワードは6文字以上にしてください', true); return; }
    auth.createUserWithEmailAndPassword(email, password)
      .then(function(){ showMsg('登録完了しました。自動ログイン中...', false); })
      .catch(function(err){ showMsg('登録エラー: ' + err.message, true); });
  };

  window.logout = function(){
    auth.signOut().then(function(){
      if(typeof onFirebaseLogout === 'function') onFirebaseLogout();
    });
  };

  function loadFromFirestore(headers, callback){
    if(!currentUser){ if(callback) callback([]); return; }
    db.collection(DB_COLLECTION)
      .where('createdBy', '==', currentUser.uid)
      .get()
      .then(function(querySnapshot){
        var rows = [];
        querySnapshot.forEach(function(doc){
          var data = doc.data();
          var row = {};
          (headers || []).forEach(function(h){ row[h] = data[h] || ''; });
          row.__docId = doc.id;
          rows.push(row);
        });
        if(callback) callback(rows);
      })
      .catch(function(err){
        console.error('Firestore load error:', err);
        if(callback) callback([]);
      });
  }

  function saveToFirestore(row, headers){
    if(!currentUser) return Promise.reject('Not logged in');
    var data = {};
    (headers || []).forEach(function(h){ data[h] = row[h] || ''; });
    data.createdBy = currentUser.uid;
    data.updatedAt = new Date().toISOString();
    if(row.__docId){
      return db.collection(DB_COLLECTION).doc(row.__docId).set(data);
    } else {
      data.createdAt = new Date().toISOString();
      return db.collection(DB_COLLECTION).add(data);
    }
  }

  function deleteFromFirestore(docId){
    if(!currentUser || !docId) return Promise.reject('Invalid params');
    return db.collection(DB_COLLECTION).doc(docId).delete();
  }

  window.FirebaseApp = {
    loadFromFirestore: loadFromFirestore,
    saveToFirestore: saveToFirestore,
    deleteFromFirestore: deleteFromFirestore,
    getCurrentUser: function(){ return currentUser; },
    getDbCollection: function(){ return DB_COLLECTION; }
  };
})();
