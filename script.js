// uint32              _levels,                                     20
// IHasher             _hasher,                                     0x3542Cbdd6c0948A0f4f82F2a1ECb33FA4f55f242
// IVerifier           _verifier,                                   0xd3cD7Ca9f22a5E3E6F51E431893d0b9aBDc80B63
// IMetadata           _metadataContract,                           0xBbc0Df4318e994987Fc12E57fA8Ff697171D684A
// IServiceProviders   _spsContract,                                0x993f1a78B3B7438bf080B0D21ffD5Ae492a4FA3d
// IPalo               _fundsContract,                              0x2bBda811Ca83237759fbEE586Ca86990bfe37277
// IAyala              _ayalaContract,                              0x56511E74bD42B9d4771fD4d34f6d5f46EbC1522D


// bytes32             _serviceProviderNode, //ENS NameHash
// string memory       _metaData,
// string memory       _serviceProviderDomain // test.cellact.nl

let currentStep = 1;

let session_id;
let user_address;

const web3 = new Web3();


document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const userAddress = params.get('user_address');
    console.log("UserAddress: " + userAddress);
    if (sessionId) {
      session_id = sessionId;
    } 
    if (userAddress && web3.utils.isAddress(userAddress)) {
        console.log("heysdsd");
      user_address = userAddress;
    }
  
  });

function nextStep(step) {
    if (step === 3) {
        populateConfirmation();
    }

    document.getElementById(`step${step}`).style.display = 'none';
    document.getElementById(`step${step + 1}`).style.display = 'block';
    currentStep++;
}

function prevStep(step) {
    document.getElementById(`step${step}`).style.display = 'none';
    document.getElementById(`step${step - 1}`).style.display = 'block';
    currentStep--;
}

// function sendRequest(){
//     const SPName = document.getElementById('name').value;
//     const ENS = document.getElementById('ENS').value;
//     const SPDomain = document.getElementById('domain').value;

//     console.log('Form submitted:', { SPName, ENS, SPDomain});

//     const metaData = JSON.stringify({ name: SPName, domain: SPDomain });

//     let JSONData;
//     if(user_address){
//         JSONData = JSON.stringify({ metadata: metaData, ens: ENS, domain : SPDomain, customer_id: session_id, user_address: user_address });
//     } else{
//         JSONData = JSON.stringify({ metadata: metaData, ens: ENS, domain : SPDomain, customer_id: session_id});
//     }

//     console.log("JSONData: ", JSONData);
//     // Here you would typically send this data to your server
//     const checkUrl = 'https://us-central1-arnacon-nl.cloudfunctions.net/register_new_service_provider';
//     fetch(checkUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSONData
//     })
//     .then(response => response.text())
//     .then(data => {
//         console.log(data);
//         alert('Registration submitted successfully!');

//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert("Error, please try later");
//     });
    
// }

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const resultElement = document.getElementById('resultTextbox');
    resultElement.innerText = "Please wait while we process your request...";
    resultElement.style.display = 'block';

    document.getElementById('submitButton').disabled = true;
    const SPName = document.getElementById('name').value;
    const ENS = document.getElementById('ENS').value;
    const SPDomain = document.getElementById('domain').value;

    console.log('Form submitted:', { SPName, ENS, SPDomain});

    const metaData = JSON.stringify({ name: SPName, domain: SPDomain });

    let JSONData;
    if(user_address){
        JSONData = JSON.stringify({ metadata: metaData, ens: ENS, domain : SPDomain, customer_id: session_id, user_address: user_address });
    } else{
        JSONData = JSON.stringify({ metadata: metaData, ens: ENS, domain : SPDomain, customer_id: session_id});
    }

    // Here you would typically send this data to your server
    const checkUrl = 'https://us-central1-arnacon-nl.cloudfunctions.net/register_new_service_provider';
    fetch(checkUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSONData
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // resultElement.innerText = "The service provider has been registered successfully! \n\n The contract address of the deployed contract is: " + data + "\n\n The ENS name is: " + ENS + "\n\n The domain is: " + SPDomain + "\n\n The metadata is: " + metaData + "\n\n The customer ID is: " + session_id + "\n\n The user address is: " + user_address + "\n\n If you have any questions or some of data is incorrect, please contact us at: cellact.com";
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error, please try later");
        resultElement.innerText = "Error: " + error + "\n Please try again later.";
        document.getElementById('submitButton').disabled = false;

    });

    resultElement.innerText = "The service provider has been registered successfully!";

    const json_to_native = { metadata: metaData, ens: ENS, domain : SPDomain, user_address: user_address }
    const data_to_send = {action: "NEWSP", body: json_to_native }
    console.log(data_to_send);
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
        window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(data_to_send))
    } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
        window.AndroidBridge.processAction(JSON.stringify(data_to_send));
    } else {
        console.log("Native interface not available");
    }
    
    resultElement.style.display = 'block';
    
});

function populateConfirmation() {
    document.getElementById('confirmSPName').textContent = document.getElementById('name').value;
    document.getElementById('confirmENS').textContent = document.getElementById('ENS').value;
    document.getElementById('confirmSPDomain').textContent = document.getElementById('domain').value;
}



function checkENSS() {


    document.getElementById('registerENS').style.display = 'none';
    if(!user_address){
        document.getElementById('password').style.display = 'none';
    }

    // let selectedDomain = document.getElementById('selectedDomain').value;
    // console.log(selectedDomain);
    // if(selectedDomain == ""){
    //     selectedDomain = "cellact";
    // }

    let ensName = document.getElementById('ensName').value;
    if (!ensName || /[^a-zA-Z]/.test(ensName)) {
        alert("Please enter a valid domain name (letters only).");
        return;
    }
    ensName = ensName.toLowerCase();
    document.getElementById('availabilityResult').textContent = "Checking Domain: \"" + ensName + "\" for availability...";
    const ensJSON = JSON.stringify({ ens: ensName});
    // resetDomainButtons();
    // Assuming the function URL to check ENS availability
    const checkUrl = 'https://europe-west4-arnacon-nl.cloudfunctions.net/resolve-ens';
    fetch(checkUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: ensJSON
    })
    .then(response => response.text())
    .then(data => {
        const availabilityElement = document.getElementById('availabilityResult');
        if (data === "0x0000000000000000000000000000000000000000") { // Zero address means available
            availabilityElement.textContent = "Domain: \""+ ensName + "\" is available!";
            availabilityElement.style.color = "green";

            if(user_address == null){
                document.getElementById('password').style.display = 'block';
            }
            document.getElementById('registerENS').style.display = 'block';
            document.getElementById('registerENS').innerText = "Register " + ensName + " Now!";
        } else {

            availabilityElement.textContent = "Domain is already taken.";
            availabilityElement.style.color = "red";

        }
    })
    .catch(error => {
        console.error('Error checking domain availability:', error);
        alert("Failed to check availability. Please try again.");

        document.getElementById('ensName').value = '';
        document.getElementById('availabilityResult').textContent = '';
        document.getElementById('ensName').focus();
    });
}

function resetDomainButtons() {
    // Get all buttons and remove the 'active' class
    const buttons = document.getElementsByClassName('domain-button');
    Array.from(buttons).forEach(button => {
        button.classList.remove('active');
    });
    // Ensure no domain is considered selected unless clicked again
    document.getElementById('selectedDomain').value = ''; // Clear any selected domain
}


function registerENSES() {
    document.getElementById('registerENS').disabled = true;
    document.getElementById('checkENS').disabled = true;
    document.getElementById('ENStep').disabled = false;

    const ensName = document.getElementById('ensName').value;

    // let domain = document.getElementById('selectedDomain').value;
    // console.log(domain);
    // if(domain == ""){
    //     domain = "cellact";
    // }

    const fullENS = ensName;
    document.getElementById('ENS').value = fullENS;
    // console.log("ENS: ", document.getElementById('ENS').value);
}

function registerENSS() {


    let ensName = document.getElementById('ensName').value;
    ensName = ensName.toLowerCase();

    document.getElementById('checkENS').disabled = true;
    document.getElementById('registerENS').disabled = true;

    // let domain = document.getElementById('selectedDomain').value;
    // console.log(domain);
    // if(domain == ""){
    //     domain = "cellact";
    // }
    const fullENS = ensName;
    console.log("FullName in registeration: ", fullENS);
    const resultElement = document.getElementById('result');
    resultElement.textContent = "Please wait while we register your domain: \"" + fullENS + "\"...";
    resultElement.style.display = 'block';

    const domain = "";
    let password = document.getElementById('password').value;
    if(user_address){
        password = "...";
    }


    const registerUrl = 'https://us-central1-arnacon-nl.cloudfunctions.net/buy_ens_w_encrypt';
    if (user_address){
        body_to_send = { ens: ensName, domain: domain, password: password, customer_id: session_id, user_address: user_address}
    } else{
        body_to_send = { ens: ensName, domain: domain, password: password, customer_id: session_id}
    }

    fetch(registerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body_to_send)
    })
    .then(response => response.text())
    .then(data => {

        if (user_address){
            const resultElement = document.getElementById('result');
            resultElement.textContent = `Domain you choosed ${fullENS} is registered successfully!`
            resultElement.style.display = 'block';

            // const data_to_send = {action: "ENS", body: { ens: fullENS, sp : data} }
            // console.log(data_to_send);
            // if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.buttonPressed) {
            //     window.webkit.messageHandlers.buttonPressed.postMessage(JSON.stringify(data_to_send))
            // } else if (window.AndroidBridge && window.AndroidBridge.processAction) {
            //     window.AndroidBridge.processAction(JSON.stringify(data_to_send));
            // } else {
            //     console.log("Native interface not available");
            // }
        } else{
            const resultElement = document.getElementById('result');
            console.log("no user address");
            resultElement.textContent = `Domain you choosed ${fullENS} is registered successfully! \n your data is encrypted and stored at service's provider- ${data}`;
            resultElement.style.display = 'block';
            document.getElementById('instructions').style.display = 'block';

        }

        document.getElementById('ENS').value = fullENS;
        console.log("ENS: ", document.getElementById('ENS').value);
        document.getElementById('registerENS').disabled = true;
        document.getElementById('checkENS').disabled = true;
        document.getElementById('ENStep').disabled = false;

    })
    .catch(error => {
        alert('Error registering ENS: ' + error.message);
        document.getElementById('checkENS').disabled = false;
        document.getElementById('registerENS').disabled = false;
    });
}

function setDomain(domain) {
    document.getElementById('selectedDomain').value = domain;
    console.log("Domain: " + domain);
    const buttons = document.getElementsByClassName('domain-button');
    Array.from(buttons).forEach(button => {
        if (button.textContent.includes(domain)) {
            button.classList.add('active');
            console.log("Added active class to:", button.textContent);
        } else {
            button.classList.remove('active');
            console.log("Removed active class from:", button.textContent);
        }
    });
}


function getDomain() {
    console.log("Domain: " + document.getElementById('selectedDomain').value);
    return document.getElementById('selectedDomain').value;
}