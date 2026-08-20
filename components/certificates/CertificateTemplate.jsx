import React from 'react';
export default function CertificateTemplate({ data, vekitOrMijar, totalScore, showReading = true }) {
  const {
    branchName,
    studentLevel,
    studentName,
    studentNumber,
    studentBirthdate,
    studentBirthplace,
    gradeReading,
    gradeReadingMax,
    gradeWriting,
    gradeWritingMax,
    gradeVekitMijar,
    gradeVekitMijarMax,
    certificateLocation,
    certificateDate,
    teacherName,
  } = data;

  return (
    <div
      className="certificate"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: '210mm',
        minHeight: '297mm',
        padding: '15mm 15mm',
        background: '#fff',
        boxShadow: '0 4px 40px rgba(0, 0, 0, 0.22)',
        fontFamily: "'Times New Roman', Times, serif",
        color: '#000',
      }}
    >
      <div
        className="certificate-title-wrapper"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          className="header-column"
          style={{
            width: '100%',
            justifyItems: 'center',
            marginTop: "-22px",
          }}
        >
          <h1
            className="certificate-title"
            style={{
              margin: 0,
              fontSize: '50px',
              fontWeight: 500,
              letterSpacing: '1px',
            }}
          >
            Fêrname
          </h1>
        </div>
      </div>

      <header>
        <div
          className="header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginTop: '20px',
            paddingBottom: '15px',
          }}
        >
          {branchName === 'Ewropayê' ? (
            <>
              <div
                className="header-left"
                style={{
                  width: '30%',
                }}
              >
                <div
                  className="logo-wrapper logo-wrapper-left"
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                >
                  <img
                    src="krg-logo.png"
                    alt="KRG Logo"
                    className="logo logo-side"
                    style={{
                      // height: 'auto',
                      height: "98px",
                      width: '115px',
                    }}
                  />
                </div>
              </div>

              <div
                className="header-column"
                style={{
                  width: '100%',
                  justifyItems: 'center',
                }}
              >
                <div
                  className="logo-wrapper logo-wrapper-center"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="sfpzk-logo.png"
                    alt="SFPZK Logo"
                    className="logo logo-main"
                    style={{
                      height: '155px',
                      width: '155px',
                      marginTop: '-15px',
                    }}
                  />
                </div>
              </div>

              <div
                className="header-right"
                style={{
                  width: '30%',
                  textAlign: 'right',
                }}
              >
                <div
                  className="logo-wrapper logo-wrapper-right"
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <img
                    src="iklf-logo.png"
                    alt="IKLF Logo"
                    className="logo logo-side"
                    style={{
                      height: '113px',
                      width: '115px',
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div
              className="header-column"
              style={{
                width: '100%',
                justifyItems: 'center',
              }}
            >
              <div
                className="logo-wrapper logo-wrapper-center"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="sfpzk-logo.png"
                  alt="SFPZK Logo"
                  className="logo logo-main"
                  style={{
                    height: '155px',
                    width: '155px',
                    marginTop: '-15px',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div
          className="institution-info"
          style={{
            marginTop: '-10px',
            textAlign: 'center',
            fontSize: '30px',
          }}
        >
          <span>Saziya Fêrkirin û Parastina Zimanê Kurdî</span>

          <span
            className="institution-branch"
            style={{
              display: 'block',
              marginTop: "-10px",
              fontSize: '28px',
            }}
          >
            Şaxa <strong id="branch-name">{branchName}</strong>
          </span>
        </div>
      </header>

      <section
        className="student-info"
        style={{
          // marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #000',
          fontSize: '21px',
        }}
      >
        <p
          className="level-text"
          style={{
            margin: '5px 0',
            textAlign: 'center',
            fontSize: '25px',
          }}
        >
          Asta <strong id="student-level">{studentLevel}</strong>
        </p>

        <p style={{ margin: '5px 0' }}>Ji bo</p>

        <strong id="student-name">{studentName}</strong>
        <br />

        Hejmar <strong id="student-number">{studentNumber}</strong>
        <br />

        <div
          className="student-details-right"
          style={{
            float: 'right',
            marginTop: '-63px',
          }}
        >
          <strong id="student-birthdate" style={{
            float: 'right'
          }}
          >{studentBirthdate}</strong>
          <br />
          <strong id="student-birthplace">{studentBirthplace}</strong>
        </div>
      </section>

      <main>
        <h3
          className="section-title"
          style={{
            margin: '40px 0 -5px',
            fontSize: '25px',
            fontWeight: 900,
          }}
        >
          Pilên Ezmûnê
        </h3>

        <div
          className="subjects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '10px 25px',
            marginBottom: '20px',
            fontSize: '23px',
          }}
        >
          {showReading && (
            <div
              className="subject-row"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '24px',
                padding: '5px 0',
                borderBottom: '1px dotted #999',

              }}
            >
              <span className="subject-name">Xwendin</span>

              <span
                className="grade-box"
                style={{
                  minWidth: '25px',
                  padding: '2px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  border: '1px solid #000',
                  background: '#fafafa',
                }}
              >
                <span id="grade-reading">{gradeReading}</span>{' / '}
                <span
                  id="grade-reading-max"
                  className="grade-max"
                  style={{ fontWeight: 100 }}
                >
                  {gradeReadingMax}
                </span>
              </span>
            </div>
          )}

          <div
            className="subject-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '24px',
              padding: '5px 0',
              borderBottom: '1px dotted #999',
            }}
          >
            <span className="subject-name">Nivîsandin</span>

            <span
              className="grade-box"
              style={{
                minWidth: '25px',
                padding: '2px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #000',
                background: '#fafafa',
              }}
            >
              <span id="grade-writing">{gradeWriting}</span>{' / '}
              <span
                id="grade-writing-max"
                className="grade-max"
                style={{ fontWeight: 100 }}
              >
                {gradeWritingMax}
              </span>
            </span>
          </div>

          <div
            className="subject-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '24px',
              padding: '5px 0',
              borderBottom: '1px dotted #999',
            }}
          >
            <span className="subject-name">{vekitOrMijar}</span>

            <span
              className="grade-box"
              style={{
                minWidth: '25px',
                padding: '2px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #000',
                background: '#fafafa',
              }}
            >
              <span id="grade-vekit-mijar">{gradeVekitMijar}</span>{' / '}
              <span
                id="grade-vekit-mijar-max"
                className="grade-max"
                style={{ fontWeight: 100 }}
              >
                {gradeVekitMijarMax}
              </span>
            </span>
          </div>

          <div
            className="subject-row total-row"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '24px',
              padding: '5px 0',
              borderBottom: '1px dotted #999',
              gap: '2rem',
              marginTop: '5px',
              fontSize: '25px',
            }}
          >
            <span className="subject-name">Tevahî</span>

            <span
              className="grade-box"
              style={{
                minWidth: '25px',
                padding: '2px 8px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #000',
                background: '#fafafa',
              }}
            >
              <span id="grade-total">{totalScore}</span> <span style={{ fontWeight: 100 }}>/ 100</span>
            </span>
          </div>
        </div>
      </main>

      <section
        className="signature-section"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          // height: '18rem',
          fontSize: "22px",
          marginTop: '62px',
        }}
      >
        <div className="stamp-container">
          <img
            src={branchName === 'Ewropayê' ? 'stamp.jpg' : 'stamp-basur.jpg'}
            alt={branchName === 'Ewropayê' ? 'SFPZK Stamp' : 'SFPZK Basur Stamp'}
            className="stamp-image"
            style={{
              width: '165px',
              height: 'auto',
              rotate: '-25deg',
            }}
          />
        </div>

        <div
          className="signature-container"
          style={{
            width: '300px',
            textAlign: 'center',
          }}
        >
          <span>
            <strong id="certificate-location">{certificateLocation}</strong>
          </span>

          <br />

          <span>
            <strong id="certificate-date">{certificateDate}</strong>
          </span>

          <p
            className="proxy-text"
            style={{
              // margin: '5px 0 0',
            }}
          >
            Bi navê mamoste
          </p>

          <div
            className="signature-line"
            style={{
              // marginTop: '5px',
              borderBottom: '1px solid #000',
            }}
          >
            <span
              id="teacher-name"
              className="signature-name"
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: '28px',
                fontStyle: 'italic',
              }}
            >
              {teacherName}
            </span>
          </div>

          {/* <p
            className="signature-title"
            style={{
              margin: '5px 0 0',
            }}
          >

          </p> */}
        </div>
      </section>
    </div>
  );
}