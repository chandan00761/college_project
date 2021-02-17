const xlsx = require("xlsx")

function verify(record) {
    let flag = true;
    // verification of registration number
    const register_pattern = /^\d{4}[A-Z]+\d{2}$/gm;
    flag = flag && register_pattern.test(record['Reg.No.']);
    // verification of session
    const session_pattern = /^\d{4}-\d{4}$/gm;
    flag = flag && session_pattern.test(record['Session']);
    // verification of semester
    flag = flag && (record['Semester'] >= 1 && record['Semester'] <=6);
    // verification of programme
    const program_pattern = /^[mM][.\s]*[tT][eE][cC][hH][.\s]*$/gm;
    flag = flag && program_pattern.test(record['Programme']);
    // verification of SPI, P_CPI, CPI
    if(record['SPI'] >= 0 && record['SPI'] <= 10 &&
        record['P_CPI'] >= 0 && record['P_CPI'] <= 10 &&
        record['CPI'] >= 0 && record['CPI'] <= 10 ) {
        return flag;
    }
    else
        return false;
}

function parse(filename){
    let data = [];
    let count = 0;
    // parsing the excel file.
    const file = xlsx.readFile(filename);
    const sheets = file.SheetNames
    for (let i =0;i<1; i++){
        // parsing each of the sheets in excel file
        const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        temp.forEach((record) => {
            if(verify(record)){
                // if the data is valid we return it for insertion in database.
                data.push({
                    "reg_no" : record['Reg_no'],
                    "session_start" : record['Session'].split('-')[0],
                    "session_end" : record['Session'].split('-')[1],
                    "semester" : record['Semester'],
                    "branch" : record['Branch'],
                    "spi" : record['SPI'],
                    "p_cpi" : record['P_CPI'],
                    "cpi" : record['CPI'],
                    "result" : record['Result']
                });
            }
            else {
                // if the data is not valid then we will increment the count of invalid records.
                // we can expand this functionality to return the exact row, column and value for which validation of data fails.
                count ++;
            }
        });
    }
    // returns the valid records and the count of invalid records in json format.
    return {
        "invalid" : count,
        "data" : data,
    }
}

module.exports = parse
