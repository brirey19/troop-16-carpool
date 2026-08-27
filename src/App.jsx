// src/App.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

// *** API URL ***
const API_URL = "https://script.google.com/macros/s/AKfycbyMVQuK3L7EmoZOY1lPlPp8o5LLtv0FjTPYXEsxWza_I-mR77oRN3_4rT2qRsbIAarr/exec"; 

// --- ICONS ---
const Icons = {
  MapPin: () => <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Check: () => <svg className="icon-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
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

const isFutureEvent = (dateStr) => {
  const eventDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return eventDate >= today;
};

const generateDiffReport = (localList, cloudList) => {
  let diffs = [];
  if (localList.length !== cloudList.length) diffs.push(`Event count mismatch`);
  cloudList.forEach(cEvt => {
    const lEvt = localList.find(l => l.id === cEvt.id);
    if (!lEvt) return;
    const lDrivers = (lEvt.drivers || []).map(d => `${d.userId}-${d.direction}`).sort().join(',');
    const cDrivers = (cEvt.drivers || []).map(d => `${d.userId}-${d.direction}`).sort().join(',');
    if (lDrivers !== cDrivers) diffs.push(`Event "${cEvt.title}": Drivers changed.`);
    const lAtt = (lEvt.attendees || []).map(a => (a.id || a) + a.status).sort().join(',');
    const cAtt = (cEvt.attendees || []).map(a => (a.id || a) + a.status).sort().join(',');
    if (lAtt !== cAtt) diffs.push(`Event "${cEvt.title}": Attendees changed.`);
  });
  return diffs;
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedId = localStorage.getItem('troop16_family_id');
    if (savedId) {
      return INITIAL_USERS.find(u => u.id === parseInt(savedId)) || null;
    }
    return null;
  }); 

  const [showSelector, setShowSelector] = useState(!currentUser);
  const [isAdmin, setIsAdmin] = useState(false); 
  
  // Data State
  const [events, setEvents] = useState([]); 
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isSavingRef = useRef(false);

  const [incomingEvents, setIncomingEvents] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [diffReport, setDiffReport] = useState([]); 

  const [seatConfig, setSeatConfig] = useState({});
  const [expandedEvents, setExpandedEvents] = useState({});
  const [drivingIntents, setDrivingIntents] = useState({});

  // Admin Form State
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventHasPLC, setNewEventHasPLC] = useState(false);

  // --- LOGIC: ASSIGNMENT ---
  const autoAssignByDistance = useCallback((event) => {
    if (!event) return event;
    const currentDrivers = event.drivers || [];
    const currentAttendees = event.attendees || [];

    let updatedDrivers = currentDrivers.map(d => ({ ...d, passengers: [] }));
    
    // Ensure "Attending" and "Attending (PLC)" pool together properly for FROM
    const directionConfigs = [
        {
            direction: event.hasPLC ? 'TO_PLC' : 'TO',
            attendeeIds: currentAttendees.filter(a => event.hasPLC ? a.status === 'Attending (PLC)' : ['Attending', 'Attending (PLC)'].includes(a.status)).map(a => a.id || a)
        },
        {
            direction: event.hasPLC ? 'TO_REGULAR' : null,
            attendeeIds: event.hasPLC ? currentAttendees.filter(a => a.status === 'Attending').map(a => a.id || a) : null
        },
        {
            direction: 'FROM',
            attendeeIds: currentAttendees.filter(a => ['Attending', 'Attending (PLC)'].includes(a.status)).map(a => a.id || a)
        }
    ].filter(d => d.direction !== null);

    directionConfigs.forEach(({ direction, attendeeIds }) => {
      const driversInDir = updatedDrivers.filter(d => d.direction === direction);
      if (driversInDir.length === 0) return; 

      const allKidsInDir = INITIAL_USERS.filter(u => attendeeIds.includes(u.id));
      const totalKids = allKidsInDir.length;

      const D1 = driversInDir[0];
      const D2 = driversInDir.length > 1 ? driversInDir[1] : null;

      const getSeatsForDriver = (d) => seatConfig[event.id] && d.userId === currentUser?.id ? seatConfig[event.id] : d.seats;
      
      const d1Kid = allKidsInDir.find(k => k.id === D1.userId);
      const d2Kid = D2 ? allKidsInDir.find(k => k.id === D2.userId) : null;

      let S1 = getSeatsForDriver(D1);
      let S2 = D2 ? getSeatsForDriver(D2) : 0;

      if (totalKids <= S1) {
        D1.passengers = allKidsInDir.map(k => k.kidName);
      } 
      else if (D2 && totalKids > S1 && totalKids <= S2) {
        D2.passengers = allKidsInDir.map(k => k.kidName);
      }
      else if (D2) {
        if (d1Kid) D1.passengers.push(d1Kid.kidName);
        if (d2Kid) D2.passengers.push(d2Kid.kidName);
        
        let remainingKids = allKidsInDir.filter(k => (!d1Kid || k.id !== d1Kid.id) && (!d2Kid || k.id !== d2Kid.id));
        const half = Math.ceil(totalKids / 2);
        
        let d1Target = Math.min(half, S1);
        let d2Target = Math.min(totalKids - d1Target, S2);
        if (d2Target < totalKids - d1Target) d1Target = Math.min(totalKids - d2Target, S1);
        
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
        
        remainingKids.filter(k => !assignedIds.has(k.id)).forEach(kid => {
            if (D1.passengers.length < S1) D1.passengers.push(kid.kidName);
            else if (D2.passengers.length < S2) D2.passengers.push(kid.kidName);
        });
      } 
      else {
        if (d1Kid && !D1.passengers.includes(d1Kid.kidName)) D1.passengers.push(d1Kid.kidName);
        allKidsInDir.filter(k => !d1Kid || k.id !== d1Kid.id).forEach(kid => {
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
      
      if (Array.isArray(data)) {
        return { events: data.filter(e => e.id).map(e => ({...e, id: String(e.id)})), templates: [] };
      }
      
      const safeEvents = (data.events || []).filter(e => e.id).map(e => ({...e, id: String(e.id)}));
      return { 
        events: safeEvents.sort((a, b) => new Date(a.date) - new Date(b.date)), 
        templates: data.templates || [] 
      };
    } catch (err) {
      console.error("Error fetching", err);
      return null;
    }
  };

  useEffect(() => {
    fetchEvents().then(data => {
      if (data) {
        const hydrated = data.events.map(ev => {
            const isLocked = checkRosterUnlock(ev.date);
            if (isLocked && ev.lockedRoster) {
                return { ...ev, drivers: ev.lockedRoster };
            }
            return autoAssignByDistance(ev);
        });
        setEvents(hydrated);
        setTemplates(data.templates);
        setLoading(false);
      }
    });
  }, [autoAssignByDistance]); 

  useEffect(() => {
    const interval = setInterval(() => {
      if (isSavingRef.current || loading) return; 
      fetchEvents().then(newData => {
        if (!newData || isSavingRef.current) return;
        
        setTemplates(newData.templates);

        const hydratedNewData = newData.events.map(ev => {
            const isLocked = checkRosterUnlock(ev.date);
            if (isLocked && ev.lockedRoster) {
                return { ...ev, drivers: ev.lockedRoster };
            }
            return autoAssignByDistance(ev);
        });
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
  }, [events, loading, autoAssignByDistance]);

  const applyUpdate = () => {
    if (incomingEvents) {
      setEvents(incomingEvents);
      setUpdateAvailable(false);
      setIncomingEvents(null);
      setDiffReport([]);
    }
  };

  const saveToCloud = (newEvents, newTemplates = templates) => {
    isSavingRef.current = true;
    setSaving(true);

    const processedEvents = newEvents.map(ev => {
      const isLocked = checkRosterUnlock(ev.date);
      if (!isLocked) {
        const calculated = autoAssignByDistance(ev);
        return { ...calculated, lockedRoster: calculated.drivers };
      } else {
        return { ...ev, lockedRoster: ev.drivers };
      }
    });

    const validEvents = processedEvents
      .filter(e => e.id && String(e.id).trim() !== "")
      .map(e => ({ ...e, id: String(e.id) }));

    const sortedEvents = [...validEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setEvents(sortedEvents); 
    setTemplates(newTemplates);
    setUpdateAvailable(false);
    
    const payload = { events: sortedEvents, templates: newTemplates };
    
    fetch(API_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(payload) })
    .then(() => {
      isSavingRef.current = false;
      setSaving(false);
    })
    .catch(() => { 
      alert("Error saving"); 
      isSavingRef.current = false;
      setSaving(false); 
    });
  };

  // --- TEMPLATE HANDLERS ---
  const handleTemplateSelect = (e) => {
    const tId = e.target.value;
    setSelectedTemplateId(tId);
    
    if (tId === "") {
        setNewEventTitle("");
        setNewEventDate("");
        setNewEventLocation("");
        setNewEventHasPLC(false);
    } else {
        const t = templates.find(t => String(t.id) === String(tId));
        if (t) {
            setNewEventTitle(t.title || "");
            setNewEventDate(t.date || ""); 
            setNewEventLocation(t.location || "");
            setNewEventHasPLC(t.hasPLC || false);
        }
    }
  };

  const handleSaveAsTemplate = () => {
    const tName = window.prompt("Enter a short name for this Template (e.g. 'Standard Troop Meeting'):", newEventTitle || "New Template");
    if (!tName) return;
    
    const newTemplate = {
        id: generateId(),
        templateName: tName,
        title: newEventTitle,
        date: newEventDate, 
        location: newEventLocation,
        hasPLC: newEventHasPLC
    };
    
    const updatedTemplates = [...templates, newTemplate];
    saveToCloud(events, updatedTemplates);
    setSelectedTemplateId(newTemplate.id);
    alert(`Template "${tName}" saved successfully!`);
  };

  // --- HANDLERS ---
  const toggleExpand = (eventId, forceState) => {
    setExpandedEvents(prev => ({ ...prev, [eventId]: forceState !== undefined ? forceState : !prev[eventId] }));
  };
  const getSeats = (eventId) => seatConfig[eventId] || 4;
  
  const updateSeats = (eventId, val) => {
    if (!currentUser) return; 
    const newSeats = parseInt(val);
    setSeatConfig({ ...seatConfig, [eventId]: newSeats });
    const newEvents = events.map(event => {
        if (event.id !== eventId) return event;
        const updatedDrivers = event.drivers.map(d => d.userId === currentUser.id ? { ...d, seats: newSeats } : d);
        return { ...event, drivers: updatedDrivers };
    });
    saveToCloud(newEvents);
  };

  const handleAddEvent = () => {
    if (!newEventTitle || !newEventDate) return alert("Please fill in title and date");
    const newEvent = { id: generateId(), title: newEventTitle, date: newEventDate, location: newEventLocation, hasPLC: newEventHasPLC, attendees: [], drivers: [] };
    saveToCloud([...events, newEvent]);
    setSelectedTemplateId("");
    setNewEventTitle(''); setNewEventDate(''); setNewEventLocation(''); setNewEventHasPLC(false);
  };
  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Delete event?")) saveToCloud(events.filter(e => e.id !== eventId));
  };
  const handleEditEvent = (eventId, field, value) => {
    saveToCloud(events.map(e => e.id === eventId ? { ...e, [field]: value } : e)); 
  };
  const toggleAttendance = (eventId, newStatus) => {
    if (!currentUser) return; 
    const newEvents = events.map(event => {
      if (event.id !== eventId) return event;
      let updatedAttendees = [...event.attendees].filter(a => (a.id || a) !== currentUser.id);
      if (newStatus) updatedAttendees.push({ id: currentUser.id, status: newStatus });
      
      const isLocked = checkRosterUnlock(event.date);
      if (isLocked) {
        return { ...event, attendees: updatedAttendees };
      }
      return autoAssignByDistance({ ...event, attendees: updatedAttendees });
    });
    saveToCloud(newEvents);
  };

  const toggleDriving = (eventId, direction) => {
    if (!currentUser) return; 
    const newEvents = events.map(event => {
      if (event.id !== eventId) return event;
      
      const isLocked = checkRosterUnlock(event.date);
      let updatedDrivers = [...event.drivers];
      
      const alreadyDriving = updatedDrivers.find(d => d.userId === currentUser.id && d.direction === direction);

      if (alreadyDriving) {
        updatedDrivers = updatedDrivers.filter(d => d !== alreadyDriving);
      } else {
        // Driver Caps
        if (direction === 'TO_PLC' && updatedDrivers.filter(d => d.direction === 'TO_PLC').length >= 1) return event;
        if (direction === 'TO_REGULAR' && updatedDrivers.filter(d => d.direction === 'TO_REGULAR').length >= 1) return event;
        if (direction === 'TO' && updatedDrivers.filter(d => d.direction === 'TO').length >= MAX_DRIVERS) return event;
        if (direction === 'FROM' && updatedDrivers.filter(d => d.direction === 'FROM').length >= MAX_DRIVERS) return event;
        
        const newDriver = { 
            userId: currentUser.id, 
            name: currentUser.name, 
            seats: getSeats(eventId), 
            direction: direction, 
            passengers: [] 
        };

        if (isLocked) {
            const existingDrivers = updatedDrivers.filter(d => d.direction === direction);
            
            if (existingDrivers.length === 0) {
                updatedDrivers.push(newDriver);
                const intermediate = { ...event, drivers: updatedDrivers };
                return autoAssignByDistance(intermediate);
            } else {
                const ownKid = INITIAL_USERS.find(u => u.id === currentUser.id);
                updatedDrivers.forEach(d => {
                    if (d.direction === direction && d.passengers.includes(ownKid.kidName)) {
                        d.passengers = d.passengers.filter(p => p !== ownKid.kidName);
                    }
                });
                if (ownKid && event.attendees.some(a => (a.id || a) === ownKid.id && ['Attending', 'Attending (PLC)'].includes(a.status))) {
                    newDriver.passengers.push(ownKid.kidName);
                }

                const attendingList = event.attendees
                    .filter(a => ['Attending', 'Attending (PLC)'].includes(a.status))
                    .map(a => INITIAL_USERS.find(u => u.id === (a.id || a)))
                    .filter(u => u); 

                let targetStatuses = [];
                if (direction === 'TO_PLC') targetStatuses = ['Attending (PLC)'];
                else if (direction === 'TO_REGULAR') targetStatuses = ['Attending'];
                else if (direction === 'TO') targetStatuses = ['Attending', 'Attending (PLC)'];
                else if (direction === 'FROM') targetStatuses = ['Attending', 'Attending (PLC)'];

                const orphans = attendingList.filter(kid => {
                    const inCar = updatedDrivers.some(d => d.direction === direction && d.passengers.includes(kid.kidName));
                    const isOwnKid = kid.id === currentUser.id;
                    const hasRightStatus = event.attendees.some(a => (a.id || a) === kid.id && targetStatuses.includes(a.status));
                    return !inCar && !isOwnKid && hasRightStatus;
                });

                let capacity = newDriver.seats;

                orphans.forEach(orphan => {
                    if (newDriver.passengers.length < capacity) {
                        newDriver.passengers.push(orphan.kidName);
                    }
                });

                updatedDrivers.push(newDriver);
            }
        } else {
            updatedDrivers.push(newDriver);
        }
      }

      const resultEvent = { ...event, drivers: updatedDrivers };
      if (!isLocked) {
          return autoAssignByDistance(resultEvent);
      }
      return resultEvent;
    });
    saveToCloud(newEvents);
  };

  const cancelAllDrives = (eventId) => {
    if (!currentUser) return; 
    const newEvents = events.map(event => {
        if (event.id !== eventId) return event;
        return { ...event, drivers: event.drivers.filter(d => d.userId !== currentUser.id) };
    });
    saveToCloud(newEvents);
  };

  // --- UI COMPONENTS ---
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
            {updateAvailable && <button className="update-btn" onClick={applyUpdate}><Icons.Sync /> Other users have made updates</button>}
        </div>
      </header>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ animation: 'spin 1.5s linear infinite', display: 'inline-block', marginBottom: '12px' }}>
              <Icons.Sync />
            </div>
            <p style={{ margin: 0, fontWeight: '500' }}>Loading schedule data...</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
        <>
            <div className="user-selector">
                {!showSelector && currentUser ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>Currently acting as:</span><br/>
                            <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{currentUser.name}</strong> <span style={{color: '#666', fontSize: '0.9rem'}}>({currentUser.kidName})</span>
                        </div>
                        <button 
                            onClick={() => setShowSelector(true)}
                            style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Change
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                        <label style={{fontSize: '0.85rem', fontWeight: 600, color: '#666'}}>Select Family:</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <select value={currentUser ? currentUser.id : ""} onChange={(e) => {
                                  if (e.target.value === "") return;
                                  const selectedId = parseInt(e.target.value);
                                  setCurrentUser(INITIAL_USERS.find(u => u.id === selectedId));
                                  localStorage.setItem('troop16_family_id', selectedId);
                                  setExpandedEvents({}); 
                                  setShowSelector(false);
                                }} style={{flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd'}}>
                                <option value="" disabled>Select your family...</option>
                                {INITIAL_USERS.map(u => <option key={u.id} value={u.id}>{u.name} ({u.kidName})</option>)}
                            </select>
                            {currentUser && (
                                <button 
                                    onClick={() => setShowSelector(false)}
                                    style={{ background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isAdmin && (
                <div className="admin-create-panel">
                    <h3>+ Create New Event</h3>
                    
                    <div className="form-row" style={{marginBottom: '15px'}}>
                        <select 
                            value={selectedTemplateId} 
                            onChange={handleTemplateSelect}
                            style={{flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--primary)', backgroundColor: '#eff6ff', fontWeight: '600', color: 'var(--primary-dark)', width: '100%'}}
                        >
                            <option value="">-- Custom Event (Blank) --</option>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>Template: {t.templateName}</option>
                            ))}
                        </select>
                    </div>

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
                    </div>
                    
                    <div className="form-row" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={handleSaveAsTemplate} 
                            style={{flex: 1, background: '#e5e7eb', color: '#374151', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600}}
                        >
                            Save as Template
                        </button>
                        <button className="primary-btn" onClick={handleAddEvent} style={{flex: 1.5}}>
                            Publish Event
                        </button>
                    </div>
                </div>
            )}
            
            {events.filter(e => isFutureEvent(e.date)).map(event => {
                const isExpanded = expandedEvents[event.id];
                
                const myAttendance = currentUser ? event.attendees.find(a => (a.id || a) === currentUser.id) : null;
                const status = myAttendance ? myAttendance.status : null; 
                
                const isRosterUnlocked = checkRosterUnlock(event.date);
                const isRosterVisible = isRosterUnlocked || isAdmin;

                const rosterEvent = (isRosterUnlocked && event.lockedRoster) 
                    ? { ...event, drivers: event.lockedRoster } 
                    : autoAssignByDistance(event);

                const drivingTo = currentUser ? event.drivers.find(d => d.userId === currentUser.id && d.direction === 'TO') : null;
                const drivingToPLC = currentUser ? event.drivers.find(d => d.userId === currentUser.id && d.direction === 'TO_PLC') : null;
                const drivingToReg = currentUser ? event.drivers.find(d => d.userId === currentUser.id && d.direction === 'TO_REGULAR') : null;
                const drivingFrom = currentUser ? event.drivers.find(d => d.userId === currentUser.id && d.direction === 'FROM') : null;
                
                const intentKey = currentUser ? `${event.id}_${currentUser.id}` : null;
                const isDrivingReal = !!drivingTo || !!drivingToPLC || !!drivingToReg || !!drivingFrom;
                const isDrivingIntent = drivingIntents[intentKey];
                
                const isDrivingYes = isDrivingReal || isDrivingIntent === true;
                const isDrivingNo = !isDrivingReal && isDrivingIntent === false;
                const showMissingInfoWarning = isDrivingYes && !isDrivingReal;

                const toDriverCount = event.drivers.filter(d => d.direction.startsWith('TO')).length;
                const fromDriverCount = event.drivers.filter(d => d.direction === 'FROM').length;
                
                // Max caps setup
                const canDriveTo = drivingTo || toDriverCount < MAX_DRIVERS;
                const canDriveToPLC = drivingToPLC || event.drivers.filter(d => d.direction === 'TO_PLC').length < 1;
                const canDriveToReg = drivingToReg || event.drivers.filter(d => d.direction === 'TO_REGULAR').length < 1;
                const canDriveFrom = drivingFrom || fromDriverCount < MAX_DRIVERS;

                const attendingCount = event.attendees.filter(a => ['Attending', 'Attending (PLC)'].includes(a.status)).length;
                const notAttendingCount = event.attendees.filter(a => a.status === 'Not Attending').length;

                const driversToList = rosterEvent.drivers.filter(d => d.direction.startsWith('TO')).map(d => d.direction === 'TO_PLC' ? `${d.name} (PLC)` : d.name);
                const driversFromList = rosterEvent.drivers.filter(d => d.direction === 'FROM').map(d => d.name);
                
                const attendingList = INITIAL_USERS.filter(u => 
                    event.attendees.some(a => (a.id || a) === u.id && ['Attending', 'Attending (PLC)'].includes(a.status))
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
                                    <h2>
                                        {event.title}
                                        {isDrivingReal && (
                                            <span style={{
                                                marginLeft: '10px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: '700',
                                                backgroundColor: 'var(--success-bg)', 
                                                color: 'var(--success-text)', 
                                                border: '1px solid var(--success-border)',
                                                padding: '2px 8px', 
                                                borderRadius: '12px',
                                                verticalAlign: 'middle',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                🚗 Driving
                                            </span>
                                        )}
                                    </h2>
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
                                <div className="summary-item"><span className="summary-badge to">Driving To:</span> {driversToList.length > 0 ? driversToList.join(', ') : <span style={{color:'#9ca3af'}}>None</span>}</div>
                                <div className="summary-item"><span className="summary-badge from">Driving From:</span> {driversFromList.length > 0 ? driversFromList.join(', ') : <span style={{color:'#9ca3af'}}>None</span>}</div>
                            </div>
                        </div>
                        {!isAdmin && (
                            <div className="header-actions">
                                {currentUser && (
                                <>
                                    <div className="action-toggle-group">
                                        <label>{currentUser.kidName} Going? {event.hasPLC && <span style={{color:'#d97706'}}>(PLC)</span>}</label>
                                        <div className="att-btn-group">
                                            {event.hasPLC ? (
                                                <>
                                                    <button style={{fontSize:'0.75rem', fontWeight:'bold', padding:'0 8px'}} className={`att-btn ${status === 'Attending (PLC)' ? 'active-green' : ''}`} onClick={() => toggleAttendance(event.id, status === 'Attending (PLC)' ? null : 'Attending (PLC)')}>PLC</button>
                                                    <button style={{fontSize:'0.75rem', fontWeight:'bold', padding:'0 8px'}} className={`att-btn ${status === 'Attending' ? 'active-green' : ''}`} onClick={() => toggleAttendance(event.id, status === 'Attending' ? null : 'Attending')}>Reg.</button>
                                                </>
                                            ) : (
                                                <button className={`att-btn ${['Attending', 'Attending (PLC)'].includes(status) ? 'active-green' : ''}`} onClick={() => toggleAttendance(event.id, ['Attending', 'Attending (PLC)'].includes(status) ? null : 'Attending')}><Icons.Check /></button>
                                            )}
                                            <button className={`att-btn ${status === 'Not Attending' ? 'active-red' : ''}`} onClick={() => toggleAttendance(event.id, status === 'Not Attending' ? null : 'Not Attending')}><Icons.X /></button>
                                        </div>
                                    </div>
                                    <div className="action-toggle-group">
                                        <label>I can drive</label>
                                        <div className="att-btn-group">
                                            <button 
                                                className={`att-btn ${isDrivingYes ? 'active-green' : ''}`} 
                                                onClick={() => {
                                                    if (!isDrivingYes) {
                                                        setDrivingIntents(prev => ({...prev, [intentKey]: true}));
                                                        toggleExpand(event.id, true);
                                                    }
                                                }}
                                            >
                                                <Icons.Check />
                                            </button>
                                            <button 
                                                className={`att-btn ${isDrivingNo ? 'active-red' : ''}`} 
                                                onClick={() => {
                                                    if (isDrivingReal) {
                                                        if(window.confirm("Are you confirming you can no longer drive for this event?")) {
                                                            cancelAllDrives(event.id);
                                                            setDrivingIntents(prev => ({...prev, [intentKey]: false}));
                                                        }
                                                    } else {
                                                        setDrivingIntents(prev => ({...prev, [intentKey]: false}));
                                                    }
                                                }}
                                            >
                                                <Icons.X />
                                            </button>
                                        </div>
                                    </div>
                                </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="expand-trigger" onClick={() => toggleExpand(event.id)} style={{ borderTop: 'none' }}>
                        {isExpanded ? <>Hide Details <Icons.ChevronUp /></> : <>View Details <Icons.ChevronDown /></>}
                    </div>

                    {isExpanded && (
                    <div className="card-body">
                        <div className="attendee-section">
                            <div className="attendee-title">Who is going?</div>
                            <div className="attendee-grid">
                                {attendingList.map(u => {
                                    const uStatus = event.attendees.find(a => (a.id || a) === u.id)?.status;
                                    const isPLC = uStatus === 'Attending (PLC)';
                                    const hasRideTo = rosterEvent.drivers.some(d => d.direction.startsWith('TO') && d.passengers.includes(u.kidName));
                                    const hasRideFrom = rosterEvent.drivers.some(d => d.direction === 'FROM' && d.passengers.includes(u.kidName));
                                    return (
                                        <div key={u.id} className="attendee-chip">
                                            {u.kidName} {isPLC && <span style={{fontSize:'0.7rem', color:'#d97706', fontWeight:'bold'}}>(PLC)</span>}
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
                                    <div className="drive-grid" style={{ gridTemplateColumns: event.hasPLC ? 'repeat(auto-fit, minmax(140px, 1fr))' : '1fr 1fr' }}>
                                        {event.hasPLC ? (
                                            <>
                                                <div className={`drive-card ${drivingToPLC ? 'selected' : ''} ${!canDriveToPLC ? 'disabled' : ''}`} onClick={() => canDriveToPLC && toggleDriving(event.id, 'TO_PLC')}>
                                                    <div className="drive-card-header">
                                                        <span className="drive-label">→ To PLC (6:30)?</span>
                                                        <div className="checkbox-custom">{drivingToPLC && <Icons.Check />}</div>
                                                    </div>
                                                </div>
                                                <div className={`drive-card ${drivingToReg ? 'selected' : ''} ${!canDriveToReg ? 'disabled' : ''}`} onClick={() => canDriveToReg && toggleDriving(event.id, 'TO_REGULAR')}>
                                                    <div className="drive-card-header">
                                                        <span className="drive-label">→ To Regular (7:30)?</span>
                                                        <div className="checkbox-custom">{drivingToReg && <Icons.Check />}</div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className={`drive-card ${drivingTo ? 'selected' : ''} ${!canDriveTo ? 'disabled' : ''}`} onClick={() => canDriveTo && toggleDriving(event.id, 'TO')}>
                                                <div className="drive-card-header">
                                                    <span className="drive-label">→ Driving TO?</span>
                                                    <div className="checkbox-custom">{drivingTo && <Icons.Check />}</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className={`drive-card ${drivingFrom ? 'selected' : ''} ${!canDriveFrom ? 'disabled' : ''}`} onClick={() => canDriveFrom && toggleDriving(event.id, 'FROM')}>
                                            <div className="drive-card-header">
                                                <span className="drive-label">← Driving FROM?</span>
                                                <div className="checkbox-custom">{drivingFrom && <Icons.Check />}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="seats-row">
                                        <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#374151', fontWeight: 500}}><Icons.CarSide /> Available Seats (including your scout):</div>
                                        <div className="seat-stepper">
                                            <button className="stepper-btn" onClick={() => updateSeats(event.id, Math.max(1, getSeats(event.id) - 1))}>−</button>
                                            <span className="stepper-val">{getSeats(event.id)}</span>
                                            <button className="stepper-btn" onClick={() => updateSeats(event.id, Math.min(8, getSeats(event.id) + 1))}>+</button>
                                        </div>
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
                                    {isRosterUnlocked && event.lockedRoster && (
                                      <div style={{backgroundColor:'#fef2f2', color:'#991b1b', fontSize:'0.8rem', padding:'8px', borderRadius:'6px', marginBottom:'10px', textAlign:'center'}}>
                                        <strong>Roster Locked:</strong> Changes made now will not update the list below.
                                      </div>
                                    )}
                                    {event.hasPLC && rosterEvent.drivers.filter(d => d.direction === 'TO_PLC').length > 0 && (
                                        <div className="roster-group"><div className="roster-tag">TO PLC (6:30)</div>
                                            {rosterEvent.drivers.filter(d => d.direction === 'TO_PLC').map(d => (
                                                <div key={d.userId} className={`car-card ${currentUser && d.userId === currentUser.id ? 'is-me' : ''}`}>
                                                    <div className="car-info"><div className="driver-name">🚗 {d.name}</div><div className="passenger-text">{d.passengers.join(', ') || 'Empty'}</div></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {event.hasPLC && rosterEvent.drivers.filter(d => d.direction === 'TO_REGULAR').length > 0 && (
                                        <div className="roster-group"><div className="roster-tag">TO REGULAR (7:30)</div>
                                            {rosterEvent.drivers.filter(d => d.direction === 'TO_REGULAR').map(d => (
                                                <div key={d.userId} className={`car-card ${currentUser && d.userId === currentUser.id ? 'is-me' : ''}`}>
                                                    <div className="car-info"><div className="driver-name">🚗 {d.name}</div><div className="passenger-text">{d.passengers.join(', ') || 'Empty'}</div></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {!event.hasPLC && (
                                        <div className="roster-group"><div className="roster-tag">TO EVENT</div>
                                            {rosterEvent.drivers.filter(d => d.direction === 'TO').map(d => (
                                                <div key={d.userId} className={`car-card ${currentUser && d.userId === currentUser.id ? 'is-me' : ''}`}>
                                                    <div className="car-info"><div className="driver-name">🚗 {d.name}</div><div className="passenger-text">{d.passengers.join(', ') || 'Empty'}</div></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="roster-group"><div className="roster-tag">FROM EVENT</div>
                                        {rosterEvent.drivers.filter(d => d.direction === 'FROM').map(d => (
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
                </div>
                );
            })}
            
            <div className="admin-footer">
                <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', fontSize:'0.85rem'}}>
                    <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                    Admin Mode
                </div>
            </div>
        </>
        )}
      </div>
    </div>
  );
}

export default App;