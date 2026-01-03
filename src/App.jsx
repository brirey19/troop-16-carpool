// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import './App.css';

// *** API URL ***
const API_URL = "https://script.google.com/macros/s/AKfycbyMVQuK3L7EmoZOY1lPlPp8o5LLtv0FjTPYXEsxWza_I-mR77oRN3_4rT2qRsbIAarr/exec"; 

// --- ICONS ---
const Icons = {
  MapPin: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Check: () => <svg className="icon-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  CarSide: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l2-2h10l2 2v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10h14" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14a2 2 0 100 4 2 2 0 000-4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 14a2 2 0 100 4 2 2 0 000-4z" /></svg>,
  ChevronDown: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  ChevronUp: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  Alert: () => <svg className="icon" style={{color: '#854d0e'}} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Clock: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Sync: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Flag: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8l-6-3-6 3-6-3-6 3zM3 21h18M5 5h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" /></svg>
};

// --- DATA ---
const INITIAL_USERS = [
  { id: 1, name: 'Block Family', kidName: 'Ethan', address: '559 Jackson Ave', lat: 41.8967, lng: -87.8176 },
  { id: 2, name: 'Irey Family', kidName: 'David', address: '739 Monroe Ave', lat: 41.8996, lng: -87.8152 },
  { id: 3, name: 'Grabowski Family', kidName: 'Kurt', address: '1311 Park Ave', lat: 41.9067, lng: -87.8185 },
  { id: 4, name: 'Kyrias-Gann Family', kidName: 'James', address: '534 Ashland Ave', lat: 41.8954, lng: -87.8228 },
  { id: 5, name: 'Murphy Family', kidName: 'Oliver', address: '718 Park Ave', lat: 41.8981, lng: -87.8182 },
  { id: 6, name: 'Sandhu Family', kidName: 'Armaan', address: '45 Franklin Ave', lat: 41.8872, lng: -87.8239 },
  { id: 7, name: 'Vroustouris Family', kidName: 'Harrison', address: '19 Gale Avenue', lat: 41.8864, lng: -87.8130 },
];

const MAX_DRIVERS = 2; 

// --- HELPERS ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999; 
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const getPLCTime = (dateStr) => {
  const d = new Date(dateStr);
  d.setHours(d.getHours() - 1);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatForInput = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = (n) => n < 10 ? '0' + n : n;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const generateId = () => Math.floor(Math.random() * 1000000000).toString();

const checkRosterUnlock = (eventDateStr) => {
  const now = new Date();
  const ctString = now.toLocaleString("en-US", { timeZone: "America/Chicago" });
  const target = new Date(eventDateStr);
  target.setHours(9, 0, 0, 0); 
  return new Date(ctString) >= target;
};

// --- DIFF REPORT ---
const generateDiffReport = (localList, cloudList) => {
  let diffs = [];
  
  if (localList.length !== cloudList.length) {
    diffs.push(`Event count mismatch: Local ${localList.length} vs Cloud ${cloudList.length}`);
  }

  cloudList.forEach(cEvt => {
    const lEvt = localList.find(l => l.id === cEvt.id);
    if (!lEvt) {
      diffs.push(`New Event found on Cloud: ${cEvt.title}`);
      return;
    }

    const lDrivers = (lEvt.drivers || []).map(d => `${d.userId}-${d.direction}`).sort().join(',');
    const cDrivers = (cEvt.drivers || []).map(d => `${d.userId}-${d.direction}`).sort().join(',');
    if (lDrivers !== cDrivers) {
      diffs.push(`Event "${cEvt.title}": Drivers changed.`);
    }

    const lAtt = (lEvt.attendees || []).map(a => (a.id || a) + a.status).sort().join(',');
    const cAtt = (cEvt.attendees || []).map(a => (a.id || a) + a.status).sort().join(',');
    if (lAtt !== cAtt) {
      diffs.push(`Event "${cEvt.title}": Attendees changed.`);
    }

    if (lEvt.hasPLC !== cEvt.hasPLC) {
      diffs.push(`Event "${cEvt.title}": PLC Status mismatch`);
    }
  });

  return diffs;
};

function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 
  
  // State
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Polling State
  const [incomingEvents, setIncomingEvents] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [diffReport, setDiffReport] = useState([]); 

  const [seatConfig, setSeatConfig] = useState({});
  const [expandedEvents, setExpandedEvents] = useState({});
  const [drivingIntents, setDrivingIntents] = useState({});

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventHasPLC, setNewEventHasPLC] = useState(false);

  // --- LOGIC: ASSIGNMENT ---
  const autoAssignByDistance = useCallback((event) => {
    if (!event) return event;
    const currentDrivers = event.drivers || [];
    const currentAttendees = event.attendees || [];

    const directions = ['TO', 'FROM'];
    let updatedDrivers = currentDrivers.map(d => ({ ...d, passengers: [] }));
    
    // Filter: Only care about people who are "Attending"
    const attendingIds = currentAttendees
      .filter(a => a.status === 'Attending')
      .map(a => a.id || a);

    const allKidsInDir = INITIAL_USERS.filter(u => attendingIds.includes(u.id));
    const totalKids = allKidsInDir.length;

    directions.forEach(direction => {
      const driversInDir = updatedDrivers.filter(d => d.direction === direction);
      if (driversInDir.length === 0) return; 

      // Sort drivers by list order
      const D1 = driversInDir[0];
      const D2 = driversInDir.length > 1 ? driversInDir[1] : null;

      // GET SEATS + 1 IF OWN KID IS ATTENDING
      const getSeatsForDriver = (d) => seatConfig[event.id] && d.userId === currentUser?.id ? seatConfig[event.id] : d.seats;
      
      const d1Kid = allKidsInDir.find(k => k.id === D1.userId);
      const d2Kid = D2 ? allKidsInDir.find(k => k.id === D2.userId) : null;

      // FIXED LOGIC: Input is "Extra Seats", so Total Capacity = Input + (1 if own kid driving)
      let S1 = getSeatsForDriver(D1);
      if (d1Kid) S1 += 1;

      let S2 = D2 ? getSeatsForDriver(D2) : 0;
      if (D2 && d2Kid) S2 += 1;

      // --- LOGIC GATES ---

      // SCENARIO 1: Driver 1 fits everyone
      if (totalKids <= S1) {
        D1.passengers = allKidsInDir.map(k => k.kidName);
      } 
      // SCENARIO 2: Driver 1 overflows, but Driver 2 fits everyone
      else if (D2 && totalKids > S1 && totalKids <= S2) {
        D2.passengers = allKidsInDir.map(k => k.kidName);
      }
      // SCENARIO 3: Split Needed (Evenly)
      else if (D2) {
        // 1. Assign Own Kids
        if (d1Kid) D1.passengers.push(d1Kid.kidName);
        if (d2Kid) D2.passengers.push(d2Kid.kidName);

        // 2. Identify Remaining
        let remainingKids = allKidsInDir.filter(k => 
          (!d1Kid || k.id !== d1Kid.id) && (!d2Kid || k.id !== d2Kid.id)
        );

        // 3. Targets
        const half = Math.ceil(totalKids / 2);
        let d1Target = Math.min(half, S1);
        let d2Target = Math.min(totalKids - d1Target, S2);

        if (d2Target < totalKids - d1Target) {
            d1Target = Math.min(totalKids - d2Target, S1);
        }

        // 4. Assign Remaining by Distance
        let edges = [];
        remainingKids.forEach(kid => {
            const u1 = INITIAL_USERS.find(u => u.id === D1.userId);
            const u2 = INITIAL_USERS.find(u => u.id === D2.userId);
            if (u1 && D1.passengers.length < d1Target) edges.push({ kid, driver: D1, dist: calculateDistance(kid.lat, kid.lng, u1.lat, u1.lng) });
            if (u2 && D2.passengers.length < d2Target) edges.push({ kid, driver: D2, dist: calculateDistance(kid.lat, kid.lng, u2.lat, u2.lng) });
        });

        edges.sort((a, b) => a.dist - b.dist);

        const assignedIds = new Set();
        edges.forEach(edge => {
            if (assignedIds.has(edge.kid.id)) return; 
            const target = edge.driver === D1 ? d1Target : d2Target;
            if (edge.driver.passengers.length < target) {
                edge.driver.passengers.push(edge.kid.kidName);
                assignedIds.add(edge.kid.id);
            }
        });
        
        const leftovers = remainingKids.filter(k => !assignedIds.has(k.id));
        leftovers.forEach(kid => {
            if (D1.passengers.length < S1) D1.passengers.push(kid.kidName);
            else if (D2.passengers.length < S2) D2.passengers.push(kid.kidName);
        });

      } 
      // SCENARIO 4: Only D1 exists but overflows
      else {
        // Own kid already added logic check needed? 
        // Logic above handled assigning own kid? No, separate block.
        
        if (d1Kid) {
            // Already counted S1 to include kid, so just push if not there
            if (!D1.passengers.includes(d1Kid.kidName)) D1.passengers.push(d1Kid.kidName);
        }
        
        const others = allKidsInDir.filter(k => !d1Kid || k.id !== d1Kid.id);
        others.forEach(kid => {
            if (D1.passengers.length < S1) D1.passengers.push(kid.kidName);
        });
      }
    });
    
    return { ...event, drivers: updatedDrivers };
  }, [seatConfig, currentUser]); 

  // --- API & POLLING ---
  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        console.error("API did not return an array:", data);
        return null;
      }

      const validEvents = data
        .filter(e => e.id && String(e.id).trim() !== "")
        .map(e => ({ ...e, id: String(e.id) }));

      return validEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (err) {
      console.error("Error fetching", err);
      return null;
    }
  };

  useEffect(() => {
    fetchEvents().then(data => {
      if (data) {
        const hydrated = data.map(e => autoAssignByDistance(e));
        setEvents(hydrated);
        setLoading(false);
      }
    });
  }, [autoAssignByDistance]); 

  useEffect(() => {
    const interval = setInterval(() => {
      if (saving || loading) return; 

      fetchEvents().then(newData => {
        if (!newData) return;
        
        const hydratedNewData = newData.map(e => autoAssignByDistance(e));
        const report = generateDiffReport(events, hydratedNewData);

        if (report.length > 0) {
          console.log("Detected Changes:", report);
          setDiffReport(report); 
          setIncomingEvents(hydratedNewData);
          setUpdateAvailable(true);
        }
      });
    }, 15000); 

    return () => clearInterval(interval);
  }, [events, saving, loading, autoAssignByDistance]);

  const applyUpdate = () => {
    if (incomingEvents) {
      setEvents(incomingEvents);
      setUpdateAvailable(false);
      setIncomingEvents(null);
      setDiffReport([]);
    }
  };

  const saveToCloud = (newEvents) => {
    const validEvents = newEvents
      .filter(e => e.id && String(e.id).trim() !== "")
      .map(e => ({ ...e, id: String(e.id) }));

    const sortedEvents = [...validEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setEvents(sortedEvents);
    setUpdateAvailable(false);
    setSaving(true);
    fetch(API_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(sortedEvents) })
    .then(() => setSaving(false))
    .catch(() => { alert("Error saving"); setSaving(false); });
  };

  // --- EVENT HANDLERS ---
  const toggleExpand = (eventId, forceState) => {
    setExpandedEvents(prev => ({ ...prev, [eventId]: forceState !== undefined ? forceState : !prev[eventId] }));
  };

  const getSeats = (eventId) => seatConfig[eventId] || 3;

  const updateSeats = (eventId, val) => {
    if (!currentUser) return; 
    const newSeats = parseInt(val);
    setSeatConfig({ ...seatConfig, [eventId]: newSeats });
    
    const newEvents = events.map(event => {
        if (event.id !== eventId) return event;
        const updatedDrivers = event.drivers.map(d => d.userId === currentUser.id ? { ...d, seats: newSeats } : d);
        return autoAssignByDistance({ ...event, drivers: updatedDrivers });
    });
    saveToCloud(newEvents);
  };

  const handleAddEvent = () => {
    if (!newEventTitle || !newEventDate) return alert("Please fill in title and date");
    const newEvent = {
      id: generateId(),
      title: newEventTitle,
      date: newEventDate,
      location: newEventLocation,
      hasPLC: newEventHasPLC,
      attendees: [],
      drivers: [],
    };
    const newEvents = [...events, newEvent];
    saveToCloud(newEvents);
    setNewEventTitle(''); setNewEventDate(''); setNewEventLocation(''); setNewEventHasPLC(false);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Delete event?")) {
      saveToCloud(events.filter(e => e.id !== eventId));
    }
  };

  const handleEditEvent = (eventId, field, value) => {
    const newEvents = events.map(e => e.id === eventId ? { ...e, [field]: value } : e);
    saveToCloud(newEvents); 
  };

  const toggleAttendance = (eventId, newStatus) => {
    if (!currentUser) return; 
    const newEvents = events.map(event => {
      if (event.id !== eventId) return event;
      
      let updatedAttendees = [...event.attendees];
      updatedAttendees = updatedAttendees.filter(a => (a.id || a) !== currentUser.id);

      if (newStatus) {
        updatedAttendees.push({ id: currentUser.id, status: newStatus });
      }
      
      return autoAssignByDistance({ ...event, attendees: updatedAttendees });
    });
    saveToCloud(newEvents);
  };

  const toggleDriving = (eventId, direction) => {
    if (!currentUser) return; 
    const newEvents = events.map(event => {
      if (event.id !== eventId) return event;
      
      const alreadyDriving = event.drivers.find(d => d.userId === currentUser.id && d.direction === direction);
      let updatedDrivers = [...event.drivers];

      if (alreadyDriving) {
        updatedDrivers = updatedDrivers.filter(d => d !== alreadyDriving);
      } else {
        const count = event.drivers.filter(d => d.direction === direction).length;
        if (count >= MAX_DRIVERS) return event; 

        const newDriver = {
            userId: currentUser.id,
            name: currentUser.name,
            seats: getSeats(eventId),
            direction: direction,
            passengers: []
        };
        updatedDrivers.push(newDriver);
      }

      return autoAssignByDistance({ ...event, drivers: updatedDrivers });
    });
    saveToCloud(newEvents);
  };

  const cancelAllDrives = (eventId) => {
    if (!currentUser) return; 
    const newEvents = events.map(event => {
        if (event.id !== eventId) return event;
        const intermediateEvent = {
            ...event,
            drivers: event.drivers.filter(d => d.userId !== currentUser.id)
        };
        return autoAssignByDistance(intermediateEvent);
    });
    saveToCloud(newEvents);
  };

  // --- UI ---
  const DateBadge = ({ dateStr }) => {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.toLocaleDateString('en-US', { day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return (
        <div className="date-badge">
            <span className="db-month">{month}</span>
            <span className="db-day">{day}</span>
            <span className="db-time">{time}</span>
        </div>
    );
  };

  return (
    <div>
      <header className="top-app-bar">
        <h1>Troop 16 Scout Carpool</h1>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            {saving && <span style={{fontSize:'0.8rem', color:'#666'}}><Icons.Sync /> Saving...</span>}
            {updateAvailable && (
              <button className="update-btn" onClick={applyUpdate}>
                <Icons.Sync /> Other users have made updates
              </button>
            )}
        </div>
      </header>

      <div className="container">
        
        {!loading && (
        <>
            <div className="user-selector">
                <label style={{fontSize: '0.85rem', fontWeight: 600, color: '#666'}}>Select Family:</label>
                <select 
                    value={currentUser ? currentUser.id : ""} 
                    onChange={(e) => {
                      if (e.target.value === "") return;
                      setCurrentUser(INITIAL_USERS.find(u => u.id === parseInt(e.target.value)));
                      setExpandedEvents({}); 
                    }}
                    style={{flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd'}}
                >
                    <option value="" disabled>Select your family...</option>
                    {INITIAL_USERS.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.kidName})</option>
                    ))}
                </select>
            </div>

            {isAdmin && (
                <div className="admin-create-panel">
                    <h3>+ Create New Event</h3>
                    <div className="form-row">
                        <input type="text" placeholder="Event Title" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} />
                        <input type="datetime-local" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} />
                    </div>
                    <div className="form-row">
                        <input type="text" placeholder="Location" value={newEventLocation} onChange={e => setNewEventLocation(e.target.value)} />
                        <div style={{display:'flex', alignItems:'center', gap:'5px', padding:'0 10px'}}>
                            <input type="checkbox" checked={newEventHasPLC} onChange={e => setNewEventHasPLC(e.target.checked)} />
                            <label style={{fontSize:'0.85rem'}}>Has PLC?</label>
                        </div>
                        <button className="primary-btn" onClick={handleAddEvent}>Create</button>
                    </div>
                </div>
            )}
            
            {events.map(event => {
                const isExpanded = expandedEvents[event.id];
                
                const myAttendance = currentUser ? event.attendees.find(a => (a.id || a) === currentUser.id) : null;
                const status = myAttendance ? myAttendance.status : null; 

                const drivingTo = currentUser ? event.drivers.find(d => d.userId === currentUser.id && d.direction === 'TO') : null;
                const drivingFrom = currentUser ? event.drivers.find(d => d.userId === currentUser.id && d.direction === 'FROM') : null;
                
                const intentKey = currentUser ? `${event.id}_${currentUser.id}` : null;
                const isDrivingReal = drivingTo || drivingFrom;
                const isDrivingIntent = drivingIntents[intentKey];
                const toggleState = !!isDrivingReal || !!isDrivingIntent;
                const showMissingInfoWarning = toggleState && !isDrivingReal;

                const toDriverCount = event.drivers.filter(d => d.direction === 'TO').length;
                const fromDriverCount = event.drivers.filter(d => d.direction === 'FROM').length;
                
                // VARS
                const canDriveTo = drivingTo || toDriverCount < MAX_DRIVERS;
                const canDriveFrom = drivingFrom || fromDriverCount < MAX_DRIVERS;

                const attendingCount = event.attendees.filter(a => a.status === 'Attending').length;
                const notAttendingCount = event.attendees.filter(a => a.status === 'Not Attending').length;

                const driversToList = event.drivers.filter(d => d.direction === 'TO').map(d => d.name);
                const driversFromList = event.drivers.filter(d => d.direction === 'FROM').map(d => d.name);
                
                const isRosterUnlocked = checkRosterUnlock(event.date);
                const isRosterVisible = isRosterUnlocked || isAdmin;

                const attendingList = INITIAL_USERS.filter(u => 
                    event.attendees.some(a => (a.id || a) === u.id && a.status === 'Attending')
                );

                return (
                <div key={event.id} className="card">
                    <div className="event-header">
                        {!isAdmin && <DateBadge dateStr={event.date} />}
                        <div className="header-info">
                            {isAdmin ? (
                                <>
                                    <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>DELETE</button>
                                    <input className="edit-input" type="text" value={event.title} onChange={(e) => handleEditEvent(event.id, 'title', e.target.value)} />
                                    <div className="meta-row">
                                        <input className="edit-input" type="datetime-local" value={formatForInput(event.date)} onChange={(e) => handleEditEvent(event.id, 'date', e.target.value)} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>{event.title}</h2>
                                    <div className="meta-row">
                                        <div className="meta-item"><Icons.MapPin />{event.location || 'No Location'}</div>
                                    </div>
                                    {event.hasPLC && <div className="meta-row" style={{color:'#d97706', fontWeight:600}}><Icons.Flag /> PLC Meeting @ {getPLCTime(event.date)}</div>}
                                </>
                            )}
                            
                            <div className="stub-summary">
                                <div className="summary-item">
                                    <span className="summary-badge kids">{attendingCount} Going</span>
                                    {notAttendingCount > 0 && <span className="summary-badge missing">{notAttendingCount} Not Going</span>}
                                </div>
                                <div className="summary-item"><span className="summary-badge to">To:</span> {driversToList.length > 0 ? driversToList.join(', ') : <span style={{color:'#9ca3af'}}>None</span>}</div>
                                <div className="summary-item"><span className="summary-badge from">From:</span> {driversFromList.length > 0 ? driversFromList.join(', ') : <span style={{color:'#9ca3af'}}>None</span>}</div>
                            </div>
                        </div>

                        {!isAdmin && (
                            <div className="header-actions">
                                {currentUser && (
                                <>
                                    <div className="action-toggle-group">
                                        <label>{currentUser.kidName} Going? {event.hasPLC && <span style={{color:'#d97706'}}>(PLC)</span>}</label>
                                        <div className="att-btn-group">
                                            <button 
                                                className={`att-btn ${status === 'Attending' ? 'active-green' : ''}`}
                                                onClick={() => toggleAttendance(event.id, status === 'Attending' ? null : 'Attending')}
                                            >
                                                <Icons.Check />
                                            </button>
                                            <button 
                                                className={`att-btn ${status === 'Not Attending' ? 'active-red' : ''}`}
                                                onClick={() => toggleAttendance(event.id, status === 'Not Attending' ? null : 'Not Attending')}
                                            >
                                                <Icons.X />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="action-toggle-group">
                                        <label>I can drive</label>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked={toggleState} onChange={(e) => {
                                                if (e.target.checked) {
                                                    setDrivingIntents(prev => ({...prev, [intentKey]: true}));
                                                    toggleExpand(event.id, true);
                                                } else {
                                                    if (isDrivingReal) {
                                                        if(window.confirm("Stop driving?")) {
                                                            cancelAllDrives(event.id);
                                                            setDrivingIntents(prev => ({...prev, [intentKey]: false}));
                                                        }
                                                    } else {
                                                        setDrivingIntents(prev => ({...prev, [intentKey]: false}));
                                                    }
                                                }
                                            }} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </>
                                )}
                            </div>
                        )}
                    </div>

                    {isExpanded && (
                    <div className="card-body">
                        <div className="attendee-section">
                            <div className="attendee-title">Who is going?</div>
                            <div className="attendee-grid">
                                {attendingList.map(u => {
                                    const hasRideTo = event.drivers.some(d => d.direction === 'TO' && d.passengers.includes(u.kidName));
                                    const hasRideFrom = event.drivers.some(d => d.direction === 'FROM' && d.passengers.includes(u.kidName));
                                    return (
                                        <div key={u.id} className="attendee-chip">
                                            {u.kidName}
                                            {isRosterVisible && (
                                                <div className="meta-item" style={{marginLeft: '8px', fontSize:'0.75rem', color: '#666'}}>
                                                    To <div className={`status-dot ${hasRideTo ? 'dot-success' : 'dot-warn'}`}></div>
                                                    | From <div className={`status-dot ${hasRideFrom ? 'dot-success' : 'dot-warn'}`}></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {!isAdmin && (
                        <div className="drive-section">
                            {!currentUser ? (
                                <div style={{textAlign:'center', color:'#666', fontStyle:'italic', padding:'10px'}}>Select a family above to volunteer.</div>
                            ) : (
                                <>
                                    {showMissingInfoWarning && (
                                        <div style={{backgroundColor: '#fefce8', border: '1px solid #fde047', color: '#854d0e', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', display: 'flex', gap:'8px', alignItems:'center'}}>
                                            <Icons.Alert /> Please select if you are driving To, From, or Both:
                                        </div>
                                    )}
                                    <div className="drive-grid">
                                        <div className={`drive-card ${drivingTo ? 'selected' : ''} ${!canDriveTo ? 'disabled' : ''}`} onClick={() => canDriveTo && toggleDriving(event.id, 'TO')}>
                                            <div className="drive-card-header">
                                                <span className="drive-label">→ Driving TO? {event.hasPLC && <div style={{fontSize:'0.75rem', color:'#d97706'}}>Arrive by {getPLCTime(event.date)}</div>}</span>
                                                <div className="checkbox-custom">{drivingTo && <Icons.Check />}</div>
                                            </div>
                                            {drivingTo && <div className="drive-status-text">You are driving.</div>}
                                        </div>
                                        <div className={`drive-card ${drivingFrom ? 'selected' : ''} ${!canDriveFrom ? 'disabled' : ''}`} onClick={() => canDriveFrom && toggleDriving(event.id, 'FROM')}>
                                            <div className="drive-card-header">
                                                <span className="drive-label">← Driving FROM?</span>
                                                <div className="checkbox-custom">{drivingFrom && <Icons.Check />}</div>
                                            </div>
                                            {drivingFrom && <div className="drive-status-text">You are driving.</div>}
                                        </div>
                                    </div>
                                    <div className="seats-row">
                                        <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#374151', fontWeight: 500}}><Icons.CarSide /> Available Seats (Other Kids):</div>
                                        <input type="number" min="1" max="8" value={getSeats(event.id)} onChange={(e) => updateSeats(event.id, e.target.value)} />
                                    </div>
                                </>
                            )}
                        </div>
                        )}

                        <div className="roster-section">
                            <div className="roster-header">CARPOOL ROSTER</div>
                            {!isRosterVisible ? (
                                <div className="roster-pending">
                                    <div style={{display:'flex', justifyContent:'center', marginBottom:'10px'}}><Icons.Clock /></div>
                                    <strong>Rosters Pending</strong>
                                    <div style={{marginTop:'4px'}}>Assignments available at 9:00 AM on event day.</div>
                                </div>
                            ) : (
                                <>
                                    <div className="roster-group"><div className="roster-tag">TO EVENT</div>
                                        {event.drivers.filter(d => d.direction === 'TO').map(d => (
                                            <div key={d.userId} className={`car-card ${currentUser && d.userId === currentUser.id ? 'is-me' : ''}`}>
                                                <div className="car-info"><div className="driver-name">🚗 {d.name}</div><div className="passenger-text">{d.passengers.join(', ') || 'Empty'}</div></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="roster-group"><div className="roster-tag">FROM EVENT</div>
                                        {event.drivers.filter(d => d.direction === 'FROM').map(d => (
                                            <div key={d.userId} className={`car-card ${currentUser && d.userId === currentUser.id ? 'is-me' : ''}`}>
                                                <div className="car-info"><div className="driver-name">🚗 {d.name}</div><div className="passenger-text">{d.passengers.join(', ') || 'Empty'}</div></div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    )}
                    <div className="expand-trigger" onClick={() => toggleExpand(event.id)}>
                        {isExpanded ? <>Hide Details <Icons.ChevronUp /></> : <>View Details <Icons.ChevronDown /></>}
                    </div>
                </div>
                );
            })}
        </>
        )}
        <div className="admin-footer">
            <div style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'0.85rem'}}>
                <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                Admin Mode
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;