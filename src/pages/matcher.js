// src/pages/matcher.js

import { useState } from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import Nav from '../components/Nav';
import { LargeCard } from '../styles/cardStyles';
import Head from 'next/head'; // tab header
import styled from 'styled-components';

export default function MatcherPage() {
    // Same useState pattern you use everywhere
    const [resume, setResume] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // NEW: track the uploaded file object
    const [resumeFile, setResumeFile] = useState(null);

    // NEW: track whether the user wants to paste or upload
    const [inputMode, setInputMode] = useState('paste'); // 'paste' or 'upload'

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // files is an array — grab the first one

        if (file && file.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            setResumeFile(null);
            return;
        }

        setError('');
        setResumeFile(file);
    };

    const handleAnalyze = async () => {
        // Validate based on which mode they're using
        if (inputMode === 'paste' && !resume.trim()) {
            setError('Please paste your resume text.');
            return;
        }
        if (inputMode === 'upload' && !resumeFile) {
            setError('Please upload a PDF resume.');
            return;
        }
        if (!jobDesc.trim()) {
            setError('Please paste a job description.');
            return;
        }

        setLoading(true);
        setResult(null);
        setError('');

        try {
            // ============================================
            // FormData instead of JSON
            // ============================================
            // When sending files, you can't use JSON.stringify() because
            // JSON is text-only — it can't hold binary file data.
            // FormData is the web standard for packaging files + text together.
            // Think of it like a shipping box: you can put documents (text)
            // and packages (files) in the same box.
            const formData = new FormData();

            // Append the job description — this always goes as text
            formData.append('jobDescription', jobDesc);

            if (inputMode === 'upload' && resumeFile) {
                // Append the actual file object.
                // 'resumeFile' is the key name — it must match what
                // the API route looks for in files.resumeFile
                formData.append('resumeFile', resumeFile);
            } else {
                // Append pasted text
                formData.append('resume', resume);
            }

            // Notice: NO 'Content-Type' header here.
            // When you send FormData, the browser automatically sets
            // the Content-Type to 'multipart/form-data' with a boundary string.
            // If you manually set it, you'll override the boundary and break the upload.
            // This is one of those "do LESS and it works" situations.
            const response = await fetch('/api/resume', {
                method: 'POST',
                body: formData,
                // ↑ NOT JSON.stringify — just the raw FormData object
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis request failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error('Failed:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            // finally runs whether the try succeeded or failed —
            // we always want to stop the loading state
            setLoading(false);
        }
    };

    return (
        <div>
            <Head>
                <title>NextRound — Resume Matcher</title>
            </Head>
            <GlobalStyles />
            <Nav />

            <div id="titleText">
                <h1>Resume Matcher</h1>
                <p style={{ color: '#888', marginTop: '8px' }}>
                    Paste your resume and a job description to see how well you match.
                </p>
            </div>

            <InputSection>
                <InputGroup>
                    <label>Your Resume</label>

                    {/* Toggle between paste and upload */}
                    <ModeToggle>
                        <ModeButton
                            active={inputMode === 'paste'}
                            onClick={() => setInputMode('paste')}
                        >
                            Paste Text
                        </ModeButton>
                        <ModeButton
                            active={inputMode === 'upload'}
                            onClick={() => setInputMode('upload')}
                        >
                            Upload PDF
                        </ModeButton>
                    </ModeToggle>

                    {inputMode === 'paste' ? (
                        <StyledTextArea
                            placeholder="Paste your resume text here..."
                            value={resume}
                            onChange={(e) => setResume(e.target.value)}
                        />
                    ) : (
                        <FileUploadArea>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                id="resumeUpload"
                                style={{ display: 'none' }}
                            />
                            {/* htmlFor connects this label to the hidden input above.
                                Clicking the label triggers the file picker.
                                We hide the default input because it's ugly and
                                unstyled across browsers — this is standard practice. */}
                            <label htmlFor="resumeUpload">
                                {resumeFile ? resumeFile.name : 'Click to choose a PDF'}
                            </label>
                            {resumeFile && (
                                <FileInfo>
                                    {/* Show file size in KB so user knows it uploaded */}
                                    {(resumeFile.size / 1024).toFixed(0)} KB
                                </FileInfo>
                            )}
                        </FileUploadArea>
                    )}
                </InputGroup>

                <InputGroup>
                    <label>Job Description</label>
                    <StyledTextArea
                        placeholder="Paste the job description here..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                    />
                </InputGroup>
            </InputSection>

            {error && <ErrorText>{error}</ErrorText>}

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <button onClick={handleAnalyze} disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze Match'}
                </button>
            </div>

            {/* Only render the results section if we have data */}
            {result && (
                <ResultsContainer>
                    {/* Score display */}
                    <ScoreCard>
                        <ScoreNumber score={result.score}>{result.score}</ScoreNumber>
                        <span style={{ fontSize: '1.2rem', color: '#888' }}>/100</span>
                        <ScoreLabel>Match Score</ScoreLabel>
                    </ScoreCard>

                    {/* Summary */}
                    {result.summary && (
                        <LargeCard>
                            <SectionTitle>Overview</SectionTitle>
                            <p>{result.summary}</p>
                        </LargeCard>
                    )}

                    {/* Skills comparison — side by side */}
                    <SkillsGrid>
                        <LargeCard>
                            <SectionTitle>Skills You Have ✓</SectionTitle>
                            <TagContainer>
                                {result.matchingSkills?.map((skill) => (
                                    <MatchTag key={skill}>{skill}</MatchTag>
                                ))}
                            </TagContainer>
                        </LargeCard>

                        <LargeCard>
                            <SectionTitle>Skills to Add</SectionTitle>
                            <TagContainer>
                                {result.missingSkills?.map((skill) => (
                                    <MissingTag key={skill}>{skill}</MissingTag>
                                ))}
                            </TagContainer>
                        </LargeCard>
                    </SkillsGrid>

                    {/* Suggestions */}
                    <LargeCard>
                        <SectionTitle>How to Improve Your Resume</SectionTitle>
                        <SuggestionsList>
                            {result.suggestions?.map((suggestion, i) => (
                                <Suggestion key={i}>
                                    <SuggestionNumber>{i + 1}</SuggestionNumber>
                                    <p>{suggestion}</p>
                                </Suggestion>
                            ))}
                        </SuggestionsList>
                    </LargeCard>
                </ResultsContainer>
            )}
        </div>
    );
}

// ============================================
// STYLED COMPONENTS
// Using your existing warm theme colors
// ============================================

const InputSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;   /* two equal columns side by side */
    gap: 20px;
    margin-bottom: 24px;
    align-items: stretch;              /* both columns match height */

    /* Stack vertically on small screens */
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;                           /* makes both columns equal height */

    label {
        font-weight: 600;
        margin-bottom: 6px;
        font-size: 0.95rem;
    }
`;

// styled()'s can't extend the global <textarea> directly,
// so we create a new styled component for it.
// This is separate from GlobalStyles because textareas
// aren't used anywhere else in the app.
const StyledTextArea = styled.textarea`
    padding: 14px;
    border: 1.5px solid #e0dbd5;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    color: #3d3530;
    background: white;
    resize: vertical;               /* users can drag to resize vertically */
    line-height: 1.6;
    transition: border-color 0.2s ease;
    flex: 1;                        /* fills remaining space in the column */
    min-height: 200px;              /* floor so it doesn't collapse */

    &:focus {
        outline: none;
        border-color: #d97756;
        box-shadow: 0 0 0 3px rgba(217, 119, 86, 0.15);
    }

    &::placeholder {
        color: #b5afa8;
    }
`;

// NEW: Toggle between paste and upload modes
const ModeToggle = styled.div`
    display: flex;
    background: #f0ece7;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 10px;
    gap: 4px;
`;

const ModeButton = styled.button`
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    /* Dynamic styles based on whether this button is the active mode */
    background: ${props => props.active ? 'white' : 'transparent'};
    color: ${props => props.active ? '#3d3530' : '#888'};
    box-shadow: ${props => props.active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};

    &:hover {
        color: #3d3530;
        /* Override the global button hover styles for these small toggles */
        background: ${props => props.active ? 'white' : 'rgba(255,255,255,0.5)'};
        transform: none;
        box-shadow: ${props => props.active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
    }
`;

// NEW: Styled drop zone for file upload
const FileUploadArea = styled.div`
    border: 2px dashed #e0dbd5;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    background: #faf8f5;
    transition: all 0.2s ease;
    cursor: pointer;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover {
        border-color: #d97756;
        background: #fdf6f3;
    }

    label {
        cursor: pointer;
        color: #d97756;
        font-weight: 600;
        font-size: 0.95rem;
    }
`;

const FileInfo = styled.span`
    display: block;
    margin-top: 8px;
    font-size: 0.8rem;
    color: #888;
`;

const ErrorText = styled.p`
    color: #c27070;
    text-align: center;
    margin-bottom: 16px;
    font-size: 0.9rem;
`;

const ResultsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ScoreCard = styled.div`
    text-align: center;
    padding: 32px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(61, 53, 48, 0.06),
                0 4px 12px rgba(61, 53, 48, 0.04);
`;

// Dynamic color based on score — green for high, amber for mid, red for low.
// This is the same pattern you use in changeBorderColor() in cardStyles.js,
// just with a ternary instead of if/else.
const ScoreNumber = styled.span`
    font-size: 3.5rem;
    font-weight: 700;
    color: ${props =>
        props.score >= 75 ? '#6bab73' :     /* sage green = good match */
        props.score >= 50 ? '#e8a44a' :     /* warm amber = decent match */
        '#c27070'                            /* dusty red = needs work */
    };
`;

const ScoreLabel = styled.p`
    color: #888;
    font-size: 0.9rem;
    margin-top: 4px;
`;

const SectionTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #3d3530;
`;

const SkillsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const TagContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

// Skill tags — same border-radius: 999px pill shape
// you now use for the tracker stats
const MatchTag = styled.span`
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 500;
    background: #edf7ee;
    color: #3d7a44;
`;

const MissingTag = styled.span`
    display: inline-block;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 500;
    background: #fdf0ec;
    color: #a14a3a;
`;

const SuggestionsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Suggestion = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;

    p {
        font-size: 0.95rem;
        line-height: 1.6;
    }
`;

// Numbered circles for each suggestion
const SuggestionNumber = styled.span`
    min-width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #d97756;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
    flex-shrink: 0;                     /* prevents circle from squishing */
`;