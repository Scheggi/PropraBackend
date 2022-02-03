import React, { useState } from "react"

function Table({list, width= 'auto', height='auto'}) {

      const colNames = ['Zeitstempel', 'Lufttemperatur', 'Streckentemperatur', 'Streckenverhältnis']


      return (
        <div>
          {list.length > 0 && (
            <table className="table table-striped table-hover table-bordered"
              cellSpacing='0'
              style={{
              	width: width,
              	height: height,
              	margin: 15,
                backgroundColor: '#d0d7de',
                tableLayout: 'fixed'
              }}>

                <thead >
                  <tr style={{backgroundColor: '#72869d', textAlign: 'center'}}>
                    {colNames.map((headerItem, index) => (
                      <th key={index}>{headerItem}</th>
                    ))}
                  </tr>
                </thead>

                <tbody style={{textAlign: 'center'}}>
                  {Object.values(list).map((obj, index) => (
                    <tr key={index}>
                      {Object.values(obj).map((value, index2) => (
                        <td key={index2}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
          )}
        </div>
        )
    }

    export default Table
