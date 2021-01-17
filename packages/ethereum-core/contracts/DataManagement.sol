pragma solidity >=0.4.22 <0.9.0;

contract DataManagement {

    struct ACList {
		string jwt;
		string dataHash;
		bool flag;
	}

    // list of uploaded data specified by hash of the data
    mapping(address => string) public uploaded_data_list;
    // access control list
    mapping(address => mapping(address => ACList)) public ac_list;

    //Access equest mapping shows a list of requesters with associated requested permissions corresponding to a data owner	
	mapping(address => address[]) public request_list;
    mapping(address => uint) public request_list_index;
    mapping(address => mapping(address => uint8)) public request_list_permission;

    // Upload Data event
    event uploadDataEvent (
		address _address,
		string _dataHash
    );

    //Grant Permission Event
    event grantAccessEvent (
		string jwt
	);

    //Request Permission Event
    event requestAccessEvent (
		address _owner,
        uint _permission
	);

  	function uploadData (address _owner, string memory _dataHash) public {
		require(msg.sender == _owner);

        // update uploaded_data_list
        uploaded_data_list[_owner] = _dataHash;

		//trigger uploadData event
		emit uploadDataEvent(_owner, _dataHash);
  	}

	function grantAccess (address _owner, address _consumer, string memory _jwt) public {
		require(msg.sender == _owner);
		require(bytes(uploaded_data_list[_owner]).length > 0); //owner have already uploaded data

		// update ac_list
		ac_list[_owner][_consumer] = ACList(_jwt, uploaded_data_list[_owner], true);
		
        //create or update permission		
		emit grantAccessEvent(_jwt);
	}

	function requestAccess(address _requester, address _owner, uint8 _permission) public {
		require(msg.sender == _requester);
		require(bytes(uploaded_data_list[_owner]).length > 0); //owner have already uploaded data

		if (request_list_permission[_owner][_requester] > 0) { //requester has been already requested
			//do nothing
		} else { // new request
			if (request_list_index[_owner] > 0) {
				request_list[_owner].push(_requester);		
				request_list_index[_owner] ++ ;
			} else {
				request_list[_owner].push(_requester);
				request_list_index[_owner] = 1; //first request for the data owner
			}
		}
		//update the request list permission
		request_list_permission[_owner][_requester] = _permission;

        emit requestAccessEvent(_owner, _permission);
	}
}
