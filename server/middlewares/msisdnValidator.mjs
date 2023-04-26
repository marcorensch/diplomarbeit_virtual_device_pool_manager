export default function msisdnValidator(req, res, next){
    const data = req.body;

    if(!data.sim_type_id) return res.status(400).send("Sim type is required");
    if(!data.msisdn) return res.status(400).send("MSISDN is required");
    if(!isValidSimType(data.sim_type_id)) return res.status(400).send("Invalid Sim Type ID, must be a number");

    if(!isValidMsisdn(data.msisdn)) return res.status(400).send("Invalid MSISDN, must be 11 digits and start with 41");
    if(data.sim_number && !isValidIccid(data.sim_number)) return res.status(400).send("Invalid SIM number (ICCID), must be 20 digits and start with 894101");

    if(data.parent_id){
        data.abonnement = null;
        data.scn = null;
    }else{
        data.parent_id = null;
        if(!isValidScn(data.scn)) return res.status(400).send("Invalid SCN, must be a number");
        if(data.abonnement && !isValidAbonnement(data.abonnement)) return res.status(400).send("Abonnement Information is required");
    }

    if(data.id && parseInt(data.id) === parseInt(data.parent_id)) return res.status(400).send("Main Contract / MSISDN cannot be the same as the current one");

    req.body = data;

    next();
}

function isValidSimType(sim_type_id){
    return /\d+/.test(sim_type_id)
}

function isValidMsisdn(msisdn){
    return msisdn.length === 11 && msisdn.startsWith('41');
}

function isValidScn(scn){
    return /\d+/.test(scn);
}

function isValidIccid(iccid){
    return iccid.length === 20 && iccid.startsWith('894101') && /\d+/.test(iccid);
}

function isValidAbonnement(abonnement){
    return abonnement.trim().length > 0;
}